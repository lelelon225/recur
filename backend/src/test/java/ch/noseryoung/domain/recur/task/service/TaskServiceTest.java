package ch.noseryoung.domain.recur.task.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import ch.noseryoung.domain.recur.models.User;
import ch.noseryoung.domain.recur.repositories.group.ProjectRepository;
import ch.noseryoung.domain.recur.security.CustomUserDetails;
import ch.noseryoung.domain.recur.task.dto.CreateTaskRequest;
import ch.noseryoung.domain.recur.task.dto.PatchTaskRequest;
import ch.noseryoung.domain.recur.task.enums.Category;
import ch.noseryoung.domain.recur.task.enums.Frequency;
import ch.noseryoung.domain.recur.task.exceptions.InvalidCompletionException;
import ch.noseryoung.domain.recur.task.exceptions.TaskNotFoundException;
import ch.noseryoung.domain.recur.task.model.Task;
import ch.noseryoung.domain.recur.task.repository.TaskRepository;
import ch.noseryoung.domain.recur.task.repository.TaskReminderOverrideRepository;
import ch.noseryoung.domain.recur.task.service.TaskUtil;

/**
 * Deckt die zentralen Business-Regeln von TaskService ab, wie sie in
 * CLAUDE.md dokumentiert sind: alle Task-Abfragen sind auf den eingeloggten
 * Owner beschraenkt, Loeschen ist nur fuer archivierte Tasks erlaubt,
 * patchTask() behandelt unveraenderte Felder als "nicht anfassen" statt sie
 * zu ueberschreiben, und die Completion-Historie (#152) haelt die Regel "max.
 * 1 Completion pro Frequenz-Intervall, ONCE max. 1 insgesamt" ein.
 */
@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private GroupMemberVisibilityService visibilityService;

    @Mock
    private NotificationDispatchService notificationDispatchService;

    @Mock
    private TaskReminderOverrideRepository taskReminderOverrideRepository;

    private TaskService taskService;
    private User owner;

    @BeforeEach
    void setUp() {
        taskService = new TaskService(taskRepository, projectRepository, new TaskUtil(), visibilityService,
                notificationDispatchService, taskReminderOverrideRepository);

        owner = User.builder().id(UUID.randomUUID()).email("owner@example.com").build();
        CustomUserDetails principal = new CustomUserDetails(owner);
        var authentication = new UsernamePasswordAuthenticationToken(
                principal, null, principal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void getTasks_returnsOnlyTasksVisibleToCurrentUser() {
        Task task = existingTask();
        when(taskRepository.findVisibleToUser(owner)).thenReturn(List.of(task));

        ResponseEntity<java.util.Collection<Task>> response = taskService.getTasks(null, null);

        assertThat(response.getBody()).containsExactly(task);
    }

    @Test
    void getTask_throwsWhenTaskDoesNotBelongToCurrentUser() {
        UUID id = UUID.randomUUID();
        when(taskRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.getTask(id))
                .isInstanceOf(TaskNotFoundException.class);
    }

    @Test
    void getTask_returnsTaskWhenOwnedByCurrentUser() {
        Task task = existingTask();
        when(taskRepository.findById(task.getId())).thenReturn(Optional.of(task));

        ResponseEntity<Task> response = taskService.getTask(task.getId());

        assertThat(response.getBody()).isEqualTo(task);
    }

    @Test
    void getTask_recomputesAmountDidAndProgressFromCompletionsInsteadOfTrustingStaleColumn() {
        // #161: amountDid/progress sind aus completions abgeleitet - ein
        // Stand aus der Spalte, der nicht mehr zum Completion-Set passt (z.B.
        // durch einen Schreibpfad, der das Ableiten vergessen hat), darf nicht
        // unverändert an den Client zurückgehen.
        LocalDate created = LocalDate.of(2024, 1, 1);
        Task task = Task.builder()
                .id(UUID.randomUUID())
                .category(Category.WORK)
                .frequency(Frequency.DAILY)
                .owner(owner)
                .dateCreated(created.atStartOfDay(java.time.ZoneOffset.UTC).toInstant())
                .dateUntil(created.plusDays(10).atStartOfDay(java.time.ZoneOffset.UTC).toInstant())
                .completions(new java.util.HashSet<>(List.of(created)))
                .amountDid(99)
                .progress(12.3)
                .build();

        when(taskRepository.findById(task.getId())).thenReturn(Optional.of(task));

        ResponseEntity<Task> response = taskService.getTask(task.getId());

        assertThat(response.getBody().getAmountDid()).isEqualTo(1);
        assertThat(response.getBody().getProgress()).isEqualTo(10.0);
    }

    @Test
    void createTask_assignsCurrentUserAsOwner() {
        CreateTaskRequest request = new CreateTaskRequest(
                "Neu", Category.WORK, Frequency.DAILY, "Beschreibung", Instant.now(), null, null, null);

        ResponseEntity<Task> response = taskService.createTask(request);

        assertThat(response.getStatusCode().value()).isEqualTo(201);
        assertThat(response.getBody().getOwner()).isEqualTo(owner);
        verify(taskRepository).save(any(Task.class));
    }

    @Test
    void patchTask_leavesFieldsUntouchedWhenNotProvided() {
        Task existing = existingTask();
        existing.setName("Alter Name");
        existing.setDescription("Alte Beschreibung");
        when(taskRepository.findById(existing.getId())).thenReturn(Optional.of(existing));

        PatchTaskRequest patch = blankPatch("Neuer Name", null);

        taskService.patchTask(existing.getId(), patch, null, null, null, null, null, null);

        assertThat(existing.getName()).isEqualTo("Neuer Name");
        assertThat(existing.getDescription()).isEqualTo("Alte Beschreibung");
    }

    @Test
    void patchTask_resetProgressClearsCompletionsAndAmountDid() {
        Task existing = existingTask();
        existing.getCompletions().add(LocalDate.now());
        existing.setAmountDid(7);
        when(taskRepository.findById(existing.getId())).thenReturn(Optional.of(existing));

        taskService.patchTask(existing.getId(), blankPatch(null, null), true, null, null, null, null, null);

        assertThat(existing.getCompletions()).isEmpty();
        assertThat(existing.getAmountDid()).isEqualTo(0);
        assertThat(existing.getLastAmountDidAt()).isNull();
    }

    @Test
    void patchTask_favoriteAndArchivedQueryParamsAreApplied() {
        Task existing = existingTask();
        when(taskRepository.findById(existing.getId())).thenReturn(Optional.of(existing));

        taskService.patchTask(existing.getId(), blankPatch(null, null), null, true, true, null, null, null);

        assertThat(existing.getIsFavorite()).isTrue();
        assertThat(existing.getIsArchived()).isTrue();
        verify(taskRepository).save(existing);
    }

    @Test
    void patchTask_throwsWhenTaskDoesNotBelongToCurrentUser() {
        UUID id = UUID.randomUUID();
        when(taskRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.patchTask(id, blankPatch(null, null), null, null, null, null, null, null))
                .isInstanceOf(TaskNotFoundException.class);
    }

    @Test
    void patchTask_amountDidQueryParamSetsValueDirectly() {
        // Bleibt für geteilte Projekt-Tasks bestehen, die #152 bewusst nicht
        // erfasst (siehe TaskService#addCompletion/removeCompletion, nur
        // persönliche Tasks) - amountDid ist dort weiterhin der einzige Weg,
        // Fortschritt zu setzen.
        Task existing = existingTask();
        when(taskRepository.findById(existing.getId())).thenReturn(Optional.of(existing));

        taskService.patchTask(existing.getId(), blankPatch(null, null), null, null, null, 3, null, null);

        assertThat(existing.getAmountDid()).isEqualTo(3);
        assertThat(existing.getCompletions()).isEmpty();
    }

    @Test
    void addCompletion_addsDateAndRecomputesProgress() {
        Task existing = dailyTask(LocalDate.now().minusDays(5));
        when(taskRepository.findByIdAndOwner(existing.getId(), owner)).thenReturn(Optional.of(existing));

        LocalDate today = LocalDate.now();
        ResponseEntity<Task> response = taskService.addCompletion(existing.getId(), today);

        assertThat(response.getBody().getCompletions()).containsExactly(today);
        assertThat(response.getBody().getAmountDid()).isEqualTo(1);
        verify(taskRepository).save(existing);
    }

    @Test
    void addCompletion_rejectsFutureDate() {
        Task existing = dailyTask(LocalDate.now().minusDays(5));
        when(taskRepository.findByIdAndOwner(existing.getId(), owner)).thenReturn(Optional.of(existing));

        assertThatThrownBy(() -> taskService.addCompletion(existing.getId(), LocalDate.now().plusDays(1)))
                .isInstanceOf(InvalidCompletionException.class);
    }

    @Test
    void addCompletion_rejectsDateBeforeTaskCreation() {
        Task existing = dailyTask(LocalDate.now().minusDays(5));
        when(taskRepository.findByIdAndOwner(existing.getId(), owner)).thenReturn(Optional.of(existing));

        assertThatThrownBy(() -> taskService.addCompletion(existing.getId(), LocalDate.now().minusDays(10)))
                .isInstanceOf(InvalidCompletionException.class);
    }

    @Test
    void addCompletion_rejectsSecondDayInSameWeeklyInterval() {
        Task existing = weeklyTask(LocalDate.now().minusDays(3));
        when(taskRepository.findByIdAndOwner(existing.getId(), owner)).thenReturn(Optional.of(existing));

        taskService.addCompletion(existing.getId(), LocalDate.now().minusDays(1));

        assertThatThrownBy(() -> taskService.addCompletion(existing.getId(), LocalDate.now()))
                .isInstanceOf(InvalidCompletionException.class);
    }

    @Test
    void addCompletion_rejectsSecondCompletionForOnceTask() {
        Task existing = Task.builder()
                .id(UUID.randomUUID())
                .owner(owner)
                .frequency(Frequency.ONCE)
                .dateCreated(Instant.now().minus(5, ChronoUnit.DAYS))
                .build();
        existing.getCompletions().add(LocalDate.now().minusDays(2));
        when(taskRepository.findByIdAndOwner(existing.getId(), owner)).thenReturn(Optional.of(existing));

        assertThatThrownBy(() -> taskService.addCompletion(existing.getId(), LocalDate.now()))
                .isInstanceOf(InvalidCompletionException.class);
    }

    @Test
    void addCompletion_backfillsLegacyAmountDidBeforeCheckingIntervalConflict() {
        // Bestandstask von vor #152: kein Completion-Set, nur der alte Zähler.
        LocalDate created = LocalDate.now().minusDays(20);
        Task existing = weeklyTask(created);
        existing.setAmountDid(2);
        existing.setLastAmountDidAt(created.plusDays(7).atStartOfDay(java.time.ZoneOffset.UTC).toInstant());
        when(taskRepository.findByIdAndOwner(existing.getId(), owner)).thenReturn(Optional.of(existing));

        // Ein anderer Tag in derselben (synthetisch belegten) Woche ist blockiert.
        assertThatThrownBy(() -> taskService.addCompletion(existing.getId(), created.plusDays(8)))
                .isInstanceOf(InvalidCompletionException.class);

        // Eine neue, noch nicht abgedeckte Woche funktioniert weiterhin.
        ResponseEntity<Task> response = taskService.addCompletion(existing.getId(), LocalDate.now());
        assertThat(response.getBody().getAmountDid()).isEqualTo(3);
    }

    @Test
    void removeCompletion_removesDateAndRecomputesProgress() {
        Task existing = dailyTask(LocalDate.now().minusDays(2));
        LocalDate today = LocalDate.now();
        existing.getCompletions().add(today);
        existing.setAmountDid(1);
        when(taskRepository.findByIdAndOwner(existing.getId(), owner)).thenReturn(Optional.of(existing));

        ResponseEntity<Task> response = taskService.removeCompletion(existing.getId(), today);

        assertThat(response.getBody().getCompletions()).isEmpty();
        assertThat(response.getBody().getAmountDid()).isEqualTo(0);
        verify(taskRepository).save(existing);
    }

    @Test
    void deleteTask_rejectsDeletionOfNonArchivedTask() {
        Task existing = existingTask();
        existing.setIsArchived(false);
        when(taskRepository.findById(existing.getId())).thenReturn(Optional.of(existing));

        ResponseEntity<Task> response = taskService.deleteTask(existing.getId());

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        verify(taskRepository, never()).deleteById(any());
    }

    @Test
    void deleteTask_allowsDeletionOfArchivedTask() {
        Task existing = existingTask();
        existing.setIsArchived(true);
        when(taskRepository.findById(existing.getId())).thenReturn(Optional.of(existing));

        ResponseEntity<Task> response = taskService.deleteTask(existing.getId());

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        verify(taskRepository).deleteById(existing.getId());
    }

    @Test
    void deleteTask_throwsWhenTaskDoesNotBelongToCurrentUser() {
        UUID id = UUID.randomUUID();
        when(taskRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.deleteTask(id))
                .isInstanceOf(TaskNotFoundException.class);
    }

    private Task existingTask() {
        return Task.builder()
                .id(UUID.randomUUID())
                .name("Bestehender Task")
                .category(Category.WORK)
                .frequency(Frequency.ONCE)
                .description("Beschreibung")
                .owner(owner)
                .build();
    }

    private Task dailyTask(LocalDate created) {
        return Task.builder()
                .id(UUID.randomUUID())
                .category(Category.WORK)
                .frequency(Frequency.DAILY)
                .owner(owner)
                .dateCreated(created.atStartOfDay(java.time.ZoneOffset.UTC).toInstant())
                .build();
    }

    private Task weeklyTask(LocalDate created) {
        return Task.builder()
                .id(UUID.randomUUID())
                .category(Category.WORK)
                .frequency(Frequency.WEEKLY)
                .owner(owner)
                .dateCreated(created.atStartOfDay(java.time.ZoneOffset.UTC).toInstant())
                .build();
    }

    // Simuliert einen echten PATCH-Body (via Jackson deserialisiert): nur die
    // tatsaechlich mitgeschickten Felder sind gesetzt.
    private static PatchTaskRequest blankPatch(String name, Category category) {
        return new PatchTaskRequest(name, category, null, null, null, null, null, null, null, null);
    }
}
