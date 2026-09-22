package ch.noseryoung.domain.recur.services;

import org.springframework.stereotype.Service;

import ch.noseryoung.domain.recur.models.NotificationSettings;
import ch.noseryoung.domain.recur.models.Task;
import ch.noseryoung.domain.recur.models.User;
import ch.noseryoung.domain.recur.repositories.NotificationSettingsRepository;

// Bündelt Email-/Push-Versand hinter den beiden Empfänger-Toggles
// (emailEnabled/pushEnabled) - gemeinsam genutzt vom TaskReminderScheduler
// (#102, Erinnerung/Überfällig) und TaskService (neuer Projekt-Task).
@Service
public class NotificationDispatchService {

    private final NotificationSettingsRepository notificationSettingsRepository;
    private final EmailService emailService;
    private final PushNotificationService pushNotificationService;

    public NotificationDispatchService(
            NotificationSettingsRepository notificationSettingsRepository,
            EmailService emailService,
            PushNotificationService pushNotificationService) {
        this.notificationSettingsRepository = notificationSettingsRepository;
        this.emailService = emailService;
        this.pushNotificationService = pushNotificationService;
    }

    // Kein Persistieren fehlender Settings hier (anders als
    // NotificationSettingsService.getOrCreateSettings) - ein Scheduler-Lauf
    // über potenziell alle User soll nicht bei jedem Durchlauf Zeilen für
    // Nutzer ohne eigene Einstellungen anlegen. Die In-Memory-Defaults
    // entsprechen denen der Entity.
    private NotificationSettings settingsFor(User recipient) {
        return notificationSettingsRepository.findByUserId(recipient.getId())
                .orElseGet(() -> NotificationSettings.builder().user(recipient).build());
    }

    public void sendReminder(User recipient, Task task) {
        NotificationSettings settings = settingsFor(recipient);
        if (Boolean.TRUE.equals(settings.getEmailEnabled())) {
            emailService.sendTaskReminderEmail(recipient, task);
        }
        if (Boolean.TRUE.equals(settings.getPushEnabled())) {
            pushNotificationService.sendToUser(recipient, "Bald fällig",
                    "\"" + task.getName() + "\" ist bald fällig.");
        }
    }

    public void sendOverdue(User recipient, Task task) {
        NotificationSettings settings = settingsFor(recipient);
        if (Boolean.TRUE.equals(settings.getEmailEnabled())) {
            emailService.sendTaskOverdueEmail(recipient, task);
        }
        if (Boolean.TRUE.equals(settings.getPushEnabled())) {
            pushNotificationService.sendToUser(recipient, "Überfällig",
                    "\"" + task.getName() + "\" ist überfällig.");
        }
    }

    public void sendProjectTaskCreated(User recipient, Task task, User creator) {
        NotificationSettings settings = settingsFor(recipient);
        if (Boolean.TRUE.equals(settings.getEmailEnabled())) {
            emailService.sendProjectTaskCreatedEmail(recipient, task, creator);
        }
        if (Boolean.TRUE.equals(settings.getPushEnabled())) {
            pushNotificationService.sendToUser(recipient, "Neuer Projekt-Task",
                    creator.getFirstName() + " hat \"" + task.getName() + "\" erstellt.");
        }
    }
}
