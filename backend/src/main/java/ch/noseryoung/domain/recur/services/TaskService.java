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
                recalculateAll(tasks);
                return ResponseEntity.status(200).body(tasks);
        }

        public ResponseEntity<Collection<Task>> getFavoriteTasks() {
                List<Task> favoriteTasks = taskRepository.findByIsFavorite(true);
                recalculateAll(favoriteTasks);
                return ResponseEntity.status(200).body(favoriteTasks);
        }

        public ResponseEntity<Collection<Task>> getArchivedTasks() {
                List<Task> archivedTasks = taskRepository.findByIsArchived(true);
                recalculateAll(archivedTasks);
                return ResponseEntity.status(200).body(archivedTasks);
        }

        // Berechnet daysInSpan und progress neu für eine Menge von Tasks.
        // War zuvor dreifach dupliziert in getTasks/getFavoriteTasks/getArchivedTasks.
        private void recalculateAll(Collection<Task> tasks) {
                tasks.forEach(task -> {
                        TaskUtil.calculateDaysInSpan(task);
                        taskUtil.calculateProgress(task);
                });
        }

        public ResponseEntity<Task> getTask(UUID id) {
                Task task = taskRepository.findById(id).orElse(null);
                return task != null ? ResponseEntity.status(200).body(task) : ResponseEntity.status(404).build();
        }

        // POST METHODS
        public ResponseEntity<Task> createTask(Task task) {
                // dateCreated wird erst von Hibernate (@CreationTimestamp) gesetzt, sobald
                // die Entity persistiert wird. Deshalb muss zuerst gespeichert werden,
                // bevor daysInSpan (abhängig von dateCreated) berechnet werden kann.
                taskRepository.save(task);

                TaskUtil.calculateDaysInSpan(task);
                taskUtil.calculateProgress(task);

                // Zweites Speichern, damit die berechneten Werte (daysInSpan, progress)
                // auch tatsächlich in der DB landen und nicht nur im Response-Objekt stehen.
                taskRepository.save(task);
                return ResponseEntity.status(201).body(task);
        }

        // PATCH METHODS
        public ResponseEntity<Task> patchTask(UUID id, Task task, Boolean resetProgress, Boolean favorite,
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
                if (favorite != null) {
                        existingTask.setIsFavorite(favorite);
                }
                if (archived != null) {
                        existingTask.setIsArchived(archived);
                }

                // Reset direkt auf der bereits geladenen Entity, statt über resetTask(id)
                // eine zweite, unabhängige Entity zu laden/speichern (führte zu doppeltem
                // DB-Write und dazu, dass der Reset von diesem save() unten wieder
                // überschrieben wurde). Reihenfolge bleibt: erst zurücksetzen, danach
                // überschreibt ein explizit mitgesendetes amountDid den Reset wieder.
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

        public ResponseEntity<Task> resetTask(UUID id) {
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