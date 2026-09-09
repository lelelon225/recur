package ch.noseryoung.domain.recur.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

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

import ch.noseryoung.domain.recur.enums.Category;
import ch.noseryoung.domain.recur.enums.Frequency;
import ch.noseryoung.domain.recur.exceptions.TaskNotFoundException;
import ch.noseryoung.domain.recur.models.Task;
import ch.noseryoung.domain.recur.models.User;
import ch.noseryoung.domain.recur.repositories.TaskRepository;
import ch.noseryoung.domain.recur.security.CustomUserDetails;
import ch.noseryoung.domain.recur.utils.TaskUtil;

/**
 * Deckt die zentralen Business-Regeln von TaskService ab, wie sie in
 * CLAUDE.md dokumentiert sind: alle Task-Abfragen sind auf den eingeloggten
 * Owner beschraenkt, Loeschen ist nur fuer archivierte Tasks erlaubt, und
 * patchTask() behandelt unveraenderte Felder als "nicht anfassen" statt sie
 * zu ueberschreiben.
 */
@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private TaskUtil taskUtil;

    private TaskService taskService;
    private User owner;

    @BeforeEach
    void setUp() {
        taskService = new TaskService(taskRepository, taskUtil);

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
    void getTasks_returnsOnlyTasksOwnedByCurrentUser() {
        Task task = existingTask();
        when(taskRepository.findByOwner(owner)).thenReturn(List.of(task));

        ResponseEntity<java.util.Collection<Task>> response = taskService.getTasks(null, null);

        assertThat(response.getBody()).containsExactly(task);
        verify(taskUtil, times(1)).calculateProgress(task);
    }

    @Test
    void getTask_throwsWhenTaskDoesNotBelongToCurrentUser() {
        UUID id = UUID.randomUUID();
        when(taskRepository.findByIdAndOwner(id, owner)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.getTask(id))
                .isInstanceOf(TaskNotFoundException.class);
    }

    @Test
    void getTask_returnsTaskWhenOwnedByCurrentUser() {
        Task task = existingTask();
        when(taskRepository.findByIdAndOwner(task.getId(), owner)).thenReturn(Optional.of(task));

        ResponseEntity<Task> response = taskService.getTask(task.getId());

        assertThat(response.getBody()).isEqualTo(task);
    }

    @Test
    void createTask_assignsCurrentUserAsOwner() {
        Task task = Task.builder().name("Neu").build();

        ResponseEntity<Task> response = taskService.createTask(task);

        assertThat(response.getStatusCode().value()).isEqualTo(201);
        assertThat(task.getOwner()).isEqualTo(owner);
        verify(taskRepository).save(task);
    }

    @Test
    void patchTask_leavesFieldsUntouchedWhenNotProvided() {
        Task existing = existingTask();
        existing.setName("Alter Name");
        existing.setDescription("Alte Beschreibung");
        when(taskRepository.findByIdAndOwner(existing.getId(), owner)).thenReturn(Optional.of(existing));

        Task patch = blankPatch();
        patch.setName("Neuer Name");

        taskService.patchTask(existing.getId(), patch, null, null, null, null);

        assertThat(existing.getName()).isEqualTo("Neuer Name");
        assertThat(existing.getDescription()).isEqualTo("Alte Beschreibung");
    }

    @Test
    void patchTask_resetProgressZeroesAmountDid() {
        Task existing = existingTask();
        existing.setAmountDid(7);
        when(taskRepository.findByIdAndOwner(existing.getId(), owner)).thenReturn(Optional.of(existing));

        taskService.patchTask(existing.getId(), blankPatch(), true, null, null, null);

        assertThat(existing.getAmountDid()).isEqualTo(0);
    }

    @Test
    void patchTask_amountDidQueryParamSetsValueDirectly() {
        Task existing = existingTask();
        existing.setAmountDid(0);
        when(taskRepository.findByIdAndOwner(existing.getId(), owner)).thenReturn(Optional.of(existing));

        taskService.patchTask(existing.getId(), blankPatch(), null, null, null, 3);

        assertThat(existing.getAmountDid()).isEqualTo(3);
    }

    @Test
    void patchTask_favoriteAndArchivedQueryParamsAreApplied() {
        Task existing = existingTask();
        when(taskRepository.findByIdAndOwner(existing.getId(), owner)).thenReturn(Optional.of(existing));

        taskService.patchTask(existing.getId(), blankPatch(), null, true, true, null);

        assertThat(existing.getIsFavorite()).isTrue();
        assertThat(existing.getIsArchived()).isTrue();
        verify(taskRepository).save(existing);
    }

    @Test
    void patchTask_throwsWhenTaskDoesNotBelongToCurrentUser() {
        UUID id = UUID.randomUUID();
        when(taskRepository.findByIdAndOwner(id, owner)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.patchTask(id, Task.builder().build(), null, null, null, null))
                .isInstanceOf(TaskNotFoundException.class);
    }

    @Test
    void deleteTask_rejectsDeletionOfNonArchivedTask() {
        Task existing = existingTask();
        existing.setIsArchived(false);
        when(taskRepository.findByIdAndOwner(existing.getId(), owner)).thenReturn(Optional.of(existing));

        ResponseEntity<Task> response = taskService.deleteTask(existing.getId());

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        verify(taskRepository, never()).deleteById(any());
    }

    @Test
    void deleteTask_allowsDeletionOfArchivedTask() {
        Task existing = existingTask();
        existing.setIsArchived(true);
        when(taskRepository.findByIdAndOwner(existing.getId(), owner)).thenReturn(Optional.of(existing));

        ResponseEntity<Task> response = taskService.deleteTask(existing.getId());

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        verify(taskRepository).deleteById(existing.getId());
    }

    @Test
    void deleteTask_throwsWhenTaskDoesNotBelongToCurrentUser() {
        UUID id = UUID.randomUUID();
        when(taskRepository.findByIdAndOwner(id, owner)).thenReturn(Optional.empty());

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

    // Simuliert einen echten PATCH-Body (via Jackson deserialisiert): nur
    // die tatsaechlich mitgeschickten Felder sind gesetzt. @Builder.Default
    // wuerde isFavorite/isArchived sonst stillschweigend auf false statt
    // null setzen, was patchTask()'s "nicht gesetzt = nicht aendern"-Logik
    // verfaelschen wuerde.
    private static Task blankPatch() {
        return Task.builder().isFavorite(null).isArchived(null).build();
    }
}
