package ch.noseryoung.domain.recur.services;

import ch.noseryoung.domain.recur.dto.CreateTaskRequest;
import ch.noseryoung.domain.recur.dto.PatchTaskRequest;
import ch.noseryoung.domain.recur.dto.ProjectReference;
import ch.noseryoung.domain.recur.enums.Frequency;
import ch.noseryoung.domain.recur.enums.ReminderLeadTime;
import ch.noseryoung.domain.recur.exceptions.InvalidCompletionException;
import ch.noseryoung.domain.recur.exceptions.NotGroupMemberException;
import ch.noseryoung.domain.recur.exceptions.ProjectNotFoundException;
import ch.noseryoung.domain.recur.exceptions.TaskNotFoundException;
import ch.noseryoung.domain.recur.models.Project;
import ch.noseryoung.domain.recur.models.Task;
import ch.noseryoung.domain.recur.models.TaskReminderOverride;
import ch.noseryoung.domain.recur.models.User;
import ch.noseryoung.domain.recur.repositories.ProjectRepository;
import ch.noseryoung.domain.recur.repositories.TaskReminderOverrideRepository;
import ch.noseryoung.domain.recur.repositories.TaskRepository;
import ch.noseryoung.domain.recur.security.CustomUserDetails;
import ch.noseryoung.domain.recur.utils.TaskUtil;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;

@Service
public class TaskService {

        private final TaskRepository taskRepository;
        private final ProjectRepository projectRepository;
        private final TaskUtil taskUtil;
        private final GroupMemberVisibilityService visibilityService;
        private final NotificationDispatchService notificationDispatchService;
        private final TaskReminderOverrideRepository taskReminderOverrideRepository;

        public TaskService(TaskRepository taskRepository, ProjectRepository projectRepository, TaskUtil taskUtil,
                        GroupMemberVisibilityService visibilityService,
                        NotificationDispatchService notificationDispatchService,
                        TaskReminderOverrideRepository taskReminderOverrideRepository) {
                this.taskRepository = taskRepository;
                this.projectRepository = projectRepository;
                this.taskUtil = taskUtil;
                this.visibilityService = visibilityService;
                this.notificationDispatchService = notificationDispatchService;
                this.taskReminderOverrideRepository = taskReminderOverrideRepository;
        }

        // Ein Task ist sichtbar/bearbeitbar für seinen persönlichen owner, oder -
        // falls er einem Projekt zugeordnet ist - für jedes Mitglied der
        // Projekt-Gruppe (geteiltes Item, alle gleichberechtigt).
        private boolean hasAccess(Task task, User user) {
                if (task.getOwner() != null && task.getOwner().equals(user)) {
                        return true;
                }
                return task.getProject() != null
                                && task.getProject().getGroup() != null
                                && task.getProject().getGroup().getMembers().contains(user);
        }

        // Löst eine vom Client mitgeschickte Projekt-Referenz (nur die id ist
        // relevant) in das gemanagte Project auf und prüft dabei, dass der User
        // Mitglied der zugehörigen Gruppe ist.
        private Project resolveProjectForAssignment(UUID projectId, User user) {
                Project managedProject = projectRepository.findById(projectId)
                                .orElseThrow(() -> new ProjectNotFoundException(projectId));

                if (managedProject.getGroup() == null || !managedProject.getGroup().getMembers().contains(user)) {
                        throw new NotGroupMemberException();
                }

                return managedProject;
        }

        // Baut für die Response eine transiente Kopie mit maskierten Mitgliedern
        // (siehe GroupMemberVisibilityService) - die verwaltete Entity bleibt
        // unangetastet, damit nichts davon in die echten Zuweisungs-/Archiv-
        // Tabellen zurückgeschrieben wird. Persönliche Tasks sind immer nur für
        // ihren eigenen owner sichtbar, daher hier sonst ein No-Op.
        //
        // Befüllt ausserdem das transiente Task.reminderLeadTime mit dem
        // Override des jeweiligen viewer für diesen Task (#102-Follow-up) -
        // dieser gemeinsame Response-Pfad ist der einzige Ort, an dem ein Task
        // je nach Betrachter unterschiedlich befüllt zurückgegeben wird, daher
        // hier statt an jeder einzelnen Aufrufstelle.
        private Task maskMembers(Task task, User viewer) {
                task.setReminderLeadTime(taskReminderOverrideRepository.findByTaskAndUser(task, viewer)
                                .map(TaskReminderOverride::getReminderLeadTime)
                                .orElse(null));

                if (task.getProject() == null) {
                        return task;
                }

                Set<User> relevantUsers = new HashSet<>(task.getAssignedMembers());
                relevantUsers.addAll(task.getArchivedBy());
                if (task.getCompletedBy() != null) {
                        relevantUsers.add(task.getCompletedBy());
                }

                Map<UUID, User> maskedById = visibilityService.maskIfHidden(relevantUsers, viewer).stream()
                                .collect(Collectors.toMap(User::getId, u -> u));

                return task.toBuilder()
                                .assignedMembers(task.getAssignedMembers().stream()
                                                .map(u -> maskedById.get(u.getId()))
                                                .collect(Collectors.toCollection(HashSet::new)))
                                .archivedBy(task.getArchivedBy().stream()
                                                .map(u -> maskedById.get(u.getId()))
                                                .collect(Collectors.toCollection(HashSet::new)))
                                .completedBy(task.getCompletedBy() != null
                                                ? maskedById.get(task.getCompletedBy().getId())
                                                : null)
                                .build();
        }

        private Collection<Task> maskMembers(Collection<Task> tasks, User viewer) {
                return tasks.stream().map(task -> maskMembers(task, viewer)).toList();
        }

        // Der Gruppen-Admin (TaskGroup.createdBy) eines Projekt-Tasks - bei
        // persönlichen Tasks immer false.
        private boolean isGroupAdmin(Task task, User user) {
                return task.getProject() != null
                                && task.getProject().getGroup() != null
                                && task.getProject().getGroup().getCreatedBy() != null
                                && task.getProject().getGroup().getCreatedBy().equals(user);
        }

        // Archivieren eines geteilten Projekt-Tasks ist pro Mitglied: wer fertig
        // ist, archiviert nur für sich (archivedBy), der Task bleibt für die
        // anderen zugewiesenen Mitglieder aktiv. Erst wenn alle zugewiesenen
        // Mitglieder archiviert haben, wird der Task global archiviert. Tasks
        // ohne Zuweisung kann nur der Admin direkt archivieren/wieder öffnen.
        // Persönliche Tasks verhalten sich unverändert (einfacher globaler Flag).
        private void applyArchivedChange(Task task, boolean desiredArchived, User actingUser) {
                if (task.getProject() == null) {
                        task.setIsArchived(desiredArchived);
                        return;
                }

                if (!desiredArchived) {
                        task.getArchivedBy().remove(actingUser);
                        task.setIsArchived(false);
                        return;
                }

                if (isGroupAdmin(task, actingUser) && task.getAssignedMembers().isEmpty()) {
                        task.setIsArchived(true);
                        return;
                }

                task.getArchivedBy().add(actingUser);

                boolean allAssignedDone = !task.getAssignedMembers().isEmpty()
                                && task.getArchivedBy().containsAll(task.getAssignedMembers());

                if (allAssignedDone) {
                        task.setIsArchived(true);
                }
        }

        // Bestimmt nach einer Änderung, ob der Task (für geteilte Projekt-Tasks)
        // als erledigt gilt, und pflegt completedBy entsprechend nach - bei
        // persönlichen Tasks bleibt completedBy ungenutzt.
        private void updateCompletedBy(Task task, User actingUser) {
                if (task.getProject() == null) {
                        return;
                }

                boolean isDone = task.getFrequency() == Frequency.ONCE
                                ? task.getAmountDid() != null && task.getAmountDid() > 0
                                : task.getProgress() != null && task.getProgress() >= 100.0;

                task.setCompletedBy(isDone ? actingUser : null);
        }

        // Liest den eingeloggten User aus dem SecurityContext. Funktioniert für
        // JWT-authentifizierte Requests, da JwtAuthenticationFilter ein
        // CustomUserDetails als Principal setzt (siehe JwtAuthenticationFilter).
        private User getCurrentUser() {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

                if (authentication == null
                                || !(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
                        throw new IllegalStateException("Kein authentifizierter User im SecurityContext gefunden");
                }

                return userDetails.getUser();
        }

        // GET METHODS
        public ResponseEntity<Collection<Task>> getTasks(Boolean archived, Boolean favorite) {
                if (archived != null && archived)
                        return getArchivedTasks();

                if (favorite != null && favorite)
                        return getFavoriteTasks();

                User user = getCurrentUser();
                Collection<Task> tasks = taskRepository.findVisibleToUser(user);
                recalculateAll(tasks);

                return ResponseEntity.ok(maskMembers(tasks, user));
        }

        public ResponseEntity<Collection<Task>> getFavoriteTasks() {
                User owner = getCurrentUser();
                List<Task> favoriteTasks = taskRepository.findByOwnerAndIsFavorite(owner, true);
                recalculateAll(favoriteTasks);

                return ResponseEntity.ok(maskMembers(favoriteTasks, owner));
        }

        public ResponseEntity<Collection<Task>> getArchivedTasks() {
                User owner = getCurrentUser();
                List<Task> archivedTasks = taskRepository.findByOwnerAndIsArchived(owner, true);
                recalculateAll(archivedTasks);

                return ResponseEntity.ok(maskMembers(archivedTasks, owner));
        }

        private void recalculateAll(Collection<Task> tasks) {
                tasks.forEach(task -> {
                        TaskUtil.calculateDaysInSpan(task);
                        // Completion-Historie (#152) ist nur für persönliche Tasks im
                        // Scope - geteilte Projekt-Tasks behalten ihre bestehende
                        // amountDid-Logik (PATCH?amountDid=..) unverändert.
                        if (task.getOwner() != null) {
                                taskUtil.syncCompletions(task);
                        }
                        taskUtil.calculateProgress(task);
                });
        }

        public ResponseEntity<Task> getTask(UUID id) {
                User user = getCurrentUser();
                Task task = taskRepository.findById(id)
                                .filter(t -> hasAccess(t, user))
                                .orElseThrow(() -> new TaskNotFoundException(id));

                return ResponseEntity.ok(maskMembers(task, user));
        }

        // POST METHODS
        public ResponseEntity<Task> createTask(CreateTaskRequest request) {

                User currentUser = getCurrentUser();

                Task task = Task.builder()
                                .name(request.name())
                                .category(request.category())
                                .frequency(request.frequency())
                                .description(request.description())
                                .dateUntil(request.dateUntil())
                                .durationMinutes(request.durationMinutes())
                                .startTime(request.startTime())
                                .build();

                ProjectReference project = request.project();
                if (project != null && project.id() != null) {
                        task.setProject(resolveProjectForAssignment(project.id(), currentUser));
                        task.setOwner(null);
                } else {
                        task.setOwner(currentUser);
                }

                TaskUtil.calculateDaysInSpan(task);
                taskUtil.calculateProgress(task);
                updateCompletedBy(task, currentUser);

                taskRepository.save(task);
                notifyGroupOfNewProjectTask(task, currentUser);

                return ResponseEntity.status(201).body(maskMembers(task, currentUser));
        }

        // #102: benachrichtigt alle übrigen Gruppenmitglieder, wenn jemand einen
        // neuen geteilten Projekt-Task erstellt hat. Persönliche Tasks (kein
        // project) betreffen niemand anderen und lösen daher nichts aus.
        private void notifyGroupOfNewProjectTask(Task task, User creator) {
                if (task.getProject() == null || task.getProject().getGroup() == null) {
                        return;
                }

                task.getProject().getGroup().getMembers().stream()
                                .filter(member -> !member.equals(creator))
                                .forEach(member -> notificationDispatchService.sendProjectTaskCreated(member, task, creator));
        }

        // PATCH METHODS
        public ResponseEntity<Task> patchTask(
                        UUID id,
                        PatchTaskRequest request,
                        Boolean resetProgress,
                        Boolean favorite,
                        Boolean archived,
                        Integer amountDid,
                        Boolean unassignProject) {

                User currentUser = getCurrentUser();
                Task existingTask = taskRepository.findById(id)
                                .filter(t -> hasAccess(t, currentUser))
                                .orElseThrow(() -> new TaskNotFoundException(id));

                if (request.name() != null) {
                        existingTask.setName(request.name());
                }

                if (request.category() != null) {
                        existingTask.setCategory(request.category());
                }

                if (request.description() != null) {
                        existingTask.setDescription(request.description());
                }

                if (request.dateUntil() != null) {
                        existingTask.setDateUntil(request.dateUntil());
                }

                if (request.frequency() != null) {
                        existingTask.setFrequency(request.frequency());
                }

                if (request.durationMinutes() != null) {
                        existingTask.setDurationMinutes(request.durationMinutes());
                }

                if (request.isFavorite() != null) {
                        existingTask.setIsFavorite(request.isFavorite());
                }

                if (request.isArchived() != null) {
                        applyArchivedChange(existingTask, request.isArchived(), currentUser);
                }

                if (favorite != null) {
                        existingTask.setIsFavorite(favorite);
                }

                if (archived != null) {
                        applyArchivedChange(existingTask, archived, currentUser);
                }

                boolean isResetProgress = resetProgress != null && resetProgress;

                if (isResetProgress) {
                        existingTask.getCompletions().clear();
                        existingTask.setAmountDid(0);
                        existingTask.setLastAmountDidAt(null);
                }

                // Nur noch für geteilte Projekt-Tasks relevant (#152: persönliche
                // Tasks laufen über addCompletion/removeCompletion, siehe unten).
                if (amountDid != null && !isResetProgress) {
                        existingTask.setAmountDid(amountDid);
                        existingTask.setLastAmountDidAt(Instant.now());
                }

                if (request.startTime() != null) {
                        existingTask.setStartTime(request.startTime());
                }

                // Nachträgliche Projekt-Zuordnung: entweder explizit auf ein anderes/neues
                // Projekt setzen (mit Mitgliedschafts-Check), oder über unassignProject
                // zurück zu einem persönlichen Task machen.
                ProjectReference project = request.project();
                if (Boolean.TRUE.equals(unassignProject)) {
                        existingTask.setProject(null);
                        existingTask.setOwner(currentUser);
                } else if (project != null && project.id() != null) {
                        existingTask.setProject(resolveProjectForAssignment(project.id(), currentUser));
                        existingTask.setOwner(null);
                }

                TaskUtil.calculateDaysInSpan(existingTask);
                taskUtil.calculateProgress(existingTask);
                updateCompletedBy(existingTask, currentUser);

                taskRepository.save(existingTask);

                return ResponseEntity.ok(maskMembers(existingTask, currentUser));
        }

        // Self-Service: ein Gruppenmitglied weist sich selbst einem geteilten
        // Projekt-Task zu bzw. meldet sich wieder ab. Bei persönlichen Tasks
        // ohne Wirkung, da Zuweisung dort kein Konzept ist.
        public ResponseEntity<Task> assignSelf(UUID id) {
                User currentUser = getCurrentUser();
                Task task = taskRepository.findById(id)
                                .filter(t -> hasAccess(t, currentUser))
                                .orElseThrow(() -> new TaskNotFoundException(id));

                if (task.getProject() != null) {
                        task.getAssignedMembers().add(currentUser);
                        taskRepository.save(task);
                }

                return ResponseEntity.ok(maskMembers(task, currentUser));
        }

        public ResponseEntity<Task> unassignSelf(UUID id) {
                User currentUser = getCurrentUser();
                Task task = taskRepository.findById(id)
                                .filter(t -> hasAccess(t, currentUser))
                                .orElseThrow(() -> new TaskNotFoundException(id));

                task.getAssignedMembers().remove(currentUser);
                task.getArchivedBy().remove(currentUser);
                taskRepository.save(task);

                return ResponseEntity.ok(maskMembers(task, currentUser));
        }

        // Setzt/löscht den Erinnerungs-Vorlauf-Override des aktuellen Users für
        // diesen Task (#102-Follow-up). Bewusst ein eigener Endpoint statt Teil
        // von PatchTaskRequest: bei geteilten Projekt-Tasks darf ein Mitglied
        // damit nur seine eigene Erinnerung ändern, nie die der anderen
        // zugewiesenen Mitglieder. leadTime == null löscht den Override wieder
        // (zurück auf die Kontoeinstellung).
        public ResponseEntity<Task> setReminderLeadTime(UUID id, ReminderLeadTime leadTime) {
                User currentUser = getCurrentUser();
                Task task = taskRepository.findById(id)
                                .filter(t -> hasAccess(t, currentUser))
                                .orElseThrow(() -> new TaskNotFoundException(id));

                Optional<TaskReminderOverride> existing = taskReminderOverrideRepository.findByTaskAndUser(task,
                                currentUser);

                if (leadTime == null) {
                        existing.ifPresent(taskReminderOverrideRepository::delete);
                } else if (existing.isPresent()) {
                        existing.get().setReminderLeadTime(leadTime);
                        taskReminderOverrideRepository.save(existing.get());
                } else {
                        taskReminderOverrideRepository.save(TaskReminderOverride.builder()
                                        .task(task)
                                        .user(currentUser)
                                        .reminderLeadTime(leadTime)
                                        .build());
                }

                return ResponseEntity.ok(maskMembers(task, currentUser));
        }

        public ResponseEntity<Task> resetTask(UUID id) {

                User owner = getCurrentUser();
                Task existingTask = taskRepository.findByIdAndOwner(id, owner)
                                .orElseThrow(() -> new TaskNotFoundException(id));

                existingTask.setAmountDid(0);

                TaskUtil.calculateDaysInSpan(existingTask);
                taskUtil.calculateProgress(existingTask);

                taskRepository.save(existingTask);

                return ResponseEntity.ok(existingTask);
        }

        // COMPLETION METHODS (#152) - nachträgliches Abhaken/Rückgängig einzelner
        // Tage. Nur für persönliche Tasks (findByIdAndOwner statt hasAccess),
        // Projekt-Tasks bleiben bei ihrer bestehenden completedBy-Logik.
        public ResponseEntity<Task> addCompletion(UUID id, LocalDate date) {
                User owner = getCurrentUser();
                Task task = taskRepository.findByIdAndOwner(id, owner)
                                .orElseThrow(() -> new TaskNotFoundException(id));

                validateCompletionDate(task, date);
                // Erst bestehenden amountDid-Zähler (Bestandstasks vor #152) in echte
                // Completions zurückübersetzen, sonst würde die Intervall-Prüfung
                // unten dessen Historie nicht kennen.
                taskUtil.backfillLegacyCompletionsIfNeeded(task);

                if (!task.getCompletions().contains(date)) {
                        assertNoIntervalConflict(task, date);
                        task.getCompletions().add(date);
                }

                TaskUtil.calculateDaysInSpan(task);
                taskUtil.deriveFromCompletions(task);
                taskUtil.calculateProgress(task);
                taskRepository.save(task);

                return ResponseEntity.ok(task);
        }

        public ResponseEntity<Task> removeCompletion(UUID id, LocalDate date) {
                User owner = getCurrentUser();
                Task task = taskRepository.findByIdAndOwner(id, owner)
                                .orElseThrow(() -> new TaskNotFoundException(id));

                // Backfill zuerst, damit "Rückgängig" bei einem Bestandstask (noch
                // keine echten Completions, nur der alte amountDid-Zähler) überhaupt
                // ein konkretes Datum zum Entfernen hat.
                taskUtil.backfillLegacyCompletionsIfNeeded(task);
                task.getCompletions().remove(date);

                TaskUtil.calculateDaysInSpan(task);
                taskUtil.deriveFromCompletions(task);
                taskUtil.calculateProgress(task);
                taskRepository.save(task);

                return ResponseEntity.ok(task);
        }

        private void validateCompletionDate(Task task, LocalDate date) {
                if (date.isAfter(LocalDate.now(ZoneOffset.UTC))) {
                        throw new InvalidCompletionException("Ein Tag in der Zukunft kann nicht abgehakt werden");
                }

                if (task.getDateCreated() != null
                                && date.isBefore(task.getDateCreated().atZone(ZoneOffset.UTC).toLocalDate())) {
                        throw new InvalidCompletionException("Das Datum liegt vor der Erstellung dieser Aufgabe");
                }
        }

        // Verhindert, dass für dasselbe Frequenz-Intervall (z.B. dieselbe Woche
        // bei WEEKLY) an zwei verschiedenen Tagen abgehakt wird - amountDid zählt
        // sonst mehr Wiederholungen als tatsächlich verstrichen sind. Bei ONCE
        // gibt es kein Intervall, dort ist stattdessen insgesamt nur 1 Completion
        // erlaubt.
        private void assertNoIntervalConflict(Task task, LocalDate date) {
                if (task.getFrequency() == Frequency.ONCE) {
                        if (!task.getCompletions().isEmpty()) {
                                throw new InvalidCompletionException("Dieser Task wurde bereits als erledigt markiert");
                        }
                        return;
                }

                Long intervalIndex = taskUtil.intervalIndexOf(task, date);
                if (intervalIndex == null) {
                        return;
                }

                boolean alreadyCoveredByAnotherDay = task.getCompletions().stream()
                                .anyMatch(existing -> intervalIndex.equals(taskUtil.intervalIndexOf(task, existing)));
                if (alreadyCoveredByAnotherDay) {
                        throw new InvalidCompletionException("Für dieses Frequenz-Intervall wurde bereits ein Tag abgehakt");
                }
        }

        // DELETE METHODS
        public ResponseEntity<Task> deleteTask(UUID id) {

                User user = getCurrentUser();
                Task task = taskRepository.findById(id)
                                .filter(t -> hasAccess(t, user))
                                .orElseThrow(() -> new TaskNotFoundException(id));

                if (!Boolean.TRUE.equals(task.getIsArchived())) {
                        return ResponseEntity.status(403).build();
                }

                taskRepository.deleteById(id);

                return ResponseEntity.ok().build();
        }

        public ResponseEntity<Task> deleteAllTasks() {

                User owner = getCurrentUser();
                taskRepository.deleteByOwner(owner);

                return ResponseEntity.ok().build();
        }
}