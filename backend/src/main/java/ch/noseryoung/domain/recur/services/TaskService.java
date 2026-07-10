package ch.noseryoung.domain.recur.services;

import ch.noseryoung.domain.recur.exceptions.TaskNotFoundException;
import ch.noseryoung.domain.recur.models.Task;
import ch.noseryoung.domain.recur.models.User;
import ch.noseryoung.domain.recur.repositories.TaskRepository;
import ch.noseryoung.domain.recur.security.CustomUserDetails;
import ch.noseryoung.domain.recur.utils.TaskUtil;

import java.util.*;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;

@Service
public class TaskService {

        private final TaskRepository taskRepository;
        private final TaskUtil taskUtil;

        public TaskService(TaskRepository taskRepository, TaskUtil taskUtil) {
                this.taskRepository = taskRepository;
                this.taskUtil = taskUtil;
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

                User owner = getCurrentUser();
                Collection<Task> tasks = taskRepository.findByOwner(owner);
                recalculateAll(tasks);

                return ResponseEntity.ok(tasks);
        }

        public ResponseEntity<Collection<Task>> getFavoriteTasks() {
                User owner = getCurrentUser();
                List<Task> favoriteTasks = taskRepository.findByOwnerAndIsFavorite(owner, true);
                recalculateAll(favoriteTasks);

                return ResponseEntity.ok(favoriteTasks);
        }

        public ResponseEntity<Collection<Task>> getArchivedTasks() {
                User owner = getCurrentUser();
                List<Task> archivedTasks = taskRepository.findByOwnerAndIsArchived(owner, true);
                recalculateAll(archivedTasks);

                return ResponseEntity.ok(archivedTasks);
        }

        private void recalculateAll(Collection<Task> tasks) {
                tasks.forEach(task -> {
                        TaskUtil.calculateDaysInSpan(task);
                        taskUtil.calculateProgress(task);
                });
        }

        public ResponseEntity<Task> getTask(UUID id) {
                User owner = getCurrentUser();
                Task task = taskRepository.findByIdAndOwner(id, owner)
                                .orElseThrow(() -> new TaskNotFoundException(id));

                return ResponseEntity.ok(task);
        }

        // POST METHODS
        public ResponseEntity<Task> createTask(Task task) {

                task.setOwner(getCurrentUser());
                taskRepository.save(task);

                TaskUtil.calculateDaysInSpan(task);
                taskUtil.calculateProgress(task);

                taskRepository.save(task);

                return ResponseEntity.status(201).body(task);
        }

        // PATCH METHODS
        public ResponseEntity<Task> patchTask(
                        UUID id,
                        Task task,
                        Boolean resetProgress,
                        Boolean favorite,
                        Boolean archived,
                        Integer amountDid) {

                User owner = getCurrentUser();
                Task existingTask = taskRepository.findByIdAndOwner(id, owner)
                                .orElseThrow(() -> new TaskNotFoundException(id));

                if (task.getName() != null) {
                        existingTask.setName(task.getName());
                }

                if (task.getCategory() != null) {
                        existingTask.setCategory(task.getCategory());
                }

                if (task.getDescription() != null) {
                        existingTask.setDescription(task.getDescription());
                }

                if (task.getDateUntil() != null) {
                        existingTask.setDateUntil(task.getDateUntil());
                }

                if (task.getFrequency() != null) {
                        existingTask.setFrequency(task.getFrequency());
                }

                if (task.getIsFavorite() != null) {
                        existingTask.setIsFavorite(task.getIsFavorite());
                }

                if (task.getIsArchived() != null) {
                        existingTask.setIsArchived(task.getIsArchived());
                }

                if (favorite != null) {
                        existingTask.setIsFavorite(favorite);
                }

                if (archived != null) {
                        existingTask.setIsArchived(archived);
                }

                if (resetProgress != null && resetProgress) {
                        existingTask.setAmountDid(0);
                }

                if (amountDid != null) {
                        existingTask.setAmountDid(amountDid);
                }

                TaskUtil.calculateDaysInSpan(existingTask);
                taskUtil.calculateProgress(existingTask);

                taskRepository.save(existingTask);

                return ResponseEntity.ok(existingTask);
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

        // DELETE METHODS
        public ResponseEntity<Task> deleteTask(UUID id) {

                User owner = getCurrentUser();
                Task task = taskRepository.findByIdAndOwner(id, owner)
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