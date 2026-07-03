package ch.noseryoung.domain.recur.services;

import ch.noseryoung.domain.recur.models.Task;
import ch.noseryoung.domain.recur.repositories.TaskRepository;
import ch.noseryoung.domain.recur.utils.TaskUtil;

import java.util.*;
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

        // GET METHODS
        public ResponseEntity<Collection<Task>> getTasks(Boolean archived, Boolean favorite) {
                if (archived != null && archived)
                        return getArchivedTasks();
                if (favorite != null && favorite)
                        return getFavoriteTasks();

                Collection<Task> tasks = taskRepository.findAll();
                tasks.forEach(task -> {
                        TaskUtil.calculateDaysInSpan(task);
                        taskUtil.calculateProgress(task);
                });
                return ResponseEntity.status(200).body(tasks);
        }

        public ResponseEntity<Collection<Task>> getFavoriteTasks() {
                taskRepository.findAll().forEach(task -> {
                        TaskUtil.calculateDaysInSpan(task);
                        taskUtil.calculateProgress(task);
                });
                return ResponseEntity.status(200).body(taskRepository.findByIsFavorite(true));
        }

        public ResponseEntity<Collection<Task>> getArchivedTasks() {
                taskRepository.findAll().forEach(task -> {
                        TaskUtil.calculateDaysInSpan(task);
                        taskUtil.calculateProgress(task);
                });
                return ResponseEntity.status(200).body(taskRepository.findByIsArchived(true));
        }

        public ResponseEntity<Task> getTask(UUID id) {
                Task task = taskRepository.findById(id).orElse(null);
                return task != null ? ResponseEntity.status(200).body(task) : ResponseEntity.status(404).build();
        }

        // POST METHODS
        public ResponseEntity<Task> createTask(Task task) {
                taskUtil.calculateProgress(task);
                taskRepository.save(task);
                return ResponseEntity.status(201).body(task);
        }

        // PATCH METHODS
        public ResponseEntity<Task> patchTask(UUID id, Task task, Boolean resetProgress, Boolean favourite,
                        Boolean archived, Integer amountDid) {
                Task existingTask = taskRepository.findById(id).orElse(null);
                if (existingTask == null) {
                        return ResponseEntity.status(404).build();
                }

                // Nur Felder übernehmen, die im Request-Body tatsächlich gesetzt wurden
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
                // Body-Felder für Favorit/Archiv (so wie dein Frontend es sendet)
                if (task.getIsFavorite() != null) {
                        existingTask.setIsFavorite(task.getIsFavorite());
                }
                if (task.getIsArchived() != null) {
                        existingTask.setIsArchived(task.getIsArchived());
                }

                // Query-Parameter überschreiben optional zusätzlich (falls mal genutzt)
                if (favourite != null) {
                        existingTask.setIsFavorite(favourite);
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
                return ResponseEntity.status(200).body(existingTask);
        }

        public ResponseEntity<Task> resetAmountDid(UUID id) {
                Task existingTask = taskRepository.findById(id).orElse(null);
                if (existingTask == null) {
                        return ResponseEntity.status(404).build();
                }
                existingTask.setAmountDid(0);
                TaskUtil.calculateDaysInSpan(existingTask);
                taskUtil.calculateProgress(existingTask);
                taskRepository.save(existingTask);
                return ResponseEntity.status(200).body(existingTask);
        }

        // Delete Methods
        public ResponseEntity<Task> deleteTask(UUID id) {
                Task task = taskRepository.findById(id).orElse(null);
                if (task == null) {
                        return ResponseEntity.status(404).build();
                }
                if (!Boolean.TRUE.equals(task.getIsArchived())) {
                        return ResponseEntity.status(403).build();
                }
                taskRepository.deleteById(id);
                return ResponseEntity.status(200).build();
        }

        public ResponseEntity<Task> deleteAllTasks() {
                taskRepository.deleteAll();
                return ResponseEntity.status(200).build();
        }

}