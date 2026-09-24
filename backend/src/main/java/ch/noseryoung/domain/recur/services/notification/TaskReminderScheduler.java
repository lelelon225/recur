package ch.noseryoung.domain.recur.services.notification;

import java.time.Duration;
import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import ch.noseryoung.domain.recur.enums.notification.NotificationType;
import ch.noseryoung.domain.recur.enums.notification.ReminderLeadTime;
import ch.noseryoung.domain.recur.models.notification.NotificationLog;
import ch.noseryoung.domain.recur.models.notification.NotificationSettings;
import ch.noseryoung.domain.recur.models.task.Task;
import ch.noseryoung.domain.recur.models.task.TaskReminderOverride;
import ch.noseryoung.domain.recur.auth.model.User;
import ch.noseryoung.domain.recur.repositories.notification.NotificationLogRepository;
import ch.noseryoung.domain.recur.repositories.notification.NotificationSettingsRepository;
import ch.noseryoung.domain.recur.repositories.task.TaskReminderOverrideRepository;
import ch.noseryoung.domain.recur.repositories.task.TaskRepository;

// #102: erkennt Tasks, die sich ihrem dateUntil nähern oder es bereits
// überschritten haben, und löst darüber Erinnerungs-/Überfällig-
// Benachrichtigungen aus. Läuft alle 15 Minuten - genug Auflösung für die
// 1h-Überfällig-Schwelle zeitgebundener Tasks, ohne bei jedem Request zu prüfen.
@Component
public class TaskReminderScheduler {

    // Feste, nicht konfigurierbare Überfällig-Schwelle (#102): zeitgebundene
    // Tasks (startTime gesetzt) gelten 1h nach dateUntil als überfällig,
    // reine Datums-Tasks (kein startTime) erst nach 1 Tag.
    private static final Duration OVERDUE_AFTER_TIMED = Duration.ofHours(1);
    private static final Duration OVERDUE_AFTER_ALL_DAY = Duration.ofDays(1);

    private final TaskRepository taskRepository;
    private final NotificationSettingsRepository notificationSettingsRepository;
    private final NotificationLogRepository notificationLogRepository;
    private final NotificationDispatchService notificationDispatchService;
    private final TaskReminderOverrideRepository taskReminderOverrideRepository;

    public TaskReminderScheduler(
            TaskRepository taskRepository,
            NotificationSettingsRepository notificationSettingsRepository,
            NotificationLogRepository notificationLogRepository,
            NotificationDispatchService notificationDispatchService,
            TaskReminderOverrideRepository taskReminderOverrideRepository) {
        this.taskRepository = taskRepository;
        this.notificationSettingsRepository = notificationSettingsRepository;
        this.notificationLogRepository = notificationLogRepository;
        this.notificationDispatchService = notificationDispatchService;
        this.taskReminderOverrideRepository = taskReminderOverrideRepository;
    }

    // Transaktion noetig, weil recipientsOf() ueber lazy
    // task.getProject().getGroup() geht - ohne offene Session wirft das eine
    // LazyInitializationException und reisst den ganzen Scheduler-Lauf ab.
    // Nicht readOnly, da processReminder/processOverdue NotificationLog-Zeilen schreiben.
    @Scheduled(fixedRate = 15 * 60 * 1000)
    @Transactional
    public void checkDueTasks() {
        Instant now = Instant.now();

        for (Task task : taskRepository.findByIsArchivedFalseAndDateUntilIsNotNull()) {
            for (User recipient : recipientsOf(task)) {
                processReminder(task, recipient, now);
                processOverdue(task, recipient, now);
            }
        }
    }

    // Persönliche Tasks: nur der owner. Projekt-Tasks: die zugewiesenen
    // Mitglieder (bzw. alle Gruppenmitglieder, solange noch niemand
    // zugewiesen ist), abzüglich wer seine Kopie bereits für sich archiviert
    // hat (siehe TaskService#applyArchivedChange) - für die ist der Task
    // bereits erledigt.
    private Set<User> recipientsOf(Task task) {
        if (task.getOwner() != null) {
            return Set.of(task.getOwner());
        }

        if (task.getProject() == null || task.getProject().getGroup() == null) {
            return Set.of();
        }

        Set<User> candidates = task.getAssignedMembers().isEmpty()
                ? task.getProject().getGroup().getMembers()
                : task.getAssignedMembers();

        Set<User> recipients = new HashSet<>(candidates);
        recipients.removeAll(task.getArchivedBy());
        return recipients;
    }

    private void processReminder(Task task, User recipient, Instant now) {
        if (notificationLogRepository.existsByTaskAndRecipientAndType(task, recipient, NotificationType.REMINDER)) {
            return;
        }

        Duration leadTime = leadTimeOf(task, recipient);
        if (now.isBefore(task.getDateUntil().minus(leadTime))) {
            return;
        }

        notificationDispatchService.sendReminder(recipient, task);
        notificationLogRepository.save(NotificationLog.builder()
                .task(task)
                .recipient(recipient)
                .type(NotificationType.REMINDER)
                .build());
    }

    private void processOverdue(Task task, User recipient, Instant now) {
        if (notificationLogRepository.existsByTaskAndRecipientAndType(task, recipient, NotificationType.OVERDUE)) {
            return;
        }

        Duration overdueAfter = task.getStartTime() != null ? OVERDUE_AFTER_TIMED : OVERDUE_AFTER_ALL_DAY;
        if (now.isBefore(task.getDateUntil().plus(overdueAfter))) {
            return;
        }

        notificationDispatchService.sendOverdue(recipient, task);
        notificationLogRepository.save(NotificationLog.builder()
                .task(task)
                .recipient(recipient)
                .type(NotificationType.OVERDUE)
                .build());
    }

    // Ein vom Empfänger selbst für diesen Task gesetzter Override
    // (#102-Follow-up, TaskReminderOverride) hat Vorrang vor seiner
    // Kontoeinstellung. Pro (task, recipient), nicht pro Task, da geteilte
    // Projekt-Tasks mehrere Empfänger mit je eigenem Vorlauf haben können.
    private Duration leadTimeOf(Task task, User recipient) {
        return taskReminderOverrideRepository.findByTaskAndUser(task, recipient)
                .map(TaskReminderOverride::getReminderLeadTime)
                .or(() -> notificationSettingsRepository.findByUserId(recipient.getId())
                        .map(NotificationSettings::getReminderLeadTime))
                .orElse(ReminderLeadTime.TWENTY_FOUR_HOURS)
                .getLeadTime();
    }
}
