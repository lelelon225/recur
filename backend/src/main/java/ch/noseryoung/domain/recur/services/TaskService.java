package ch.noseryoung.domain.recur.services;

import ch.noseryoung.domain.recur.models.Task;
import ch.noseryoung.domain.recur.repositories.TaskRepository;

import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;

@Service
public class TaskService {

        private final TaskRepository taskRepository;

        public TaskService(TaskRepository taskRepository) {
                this.taskRepository = taskRepository;
        }

        public ResponseEntity<Collection<Task>> getTasks() {
                return ResponseEntity.status(200).body(taskRepository.findAll());
        }

        public ResponseEntity<Task> getTask(UUID id) {
                Task task = taskRepository.findById(id).orElse(null);
                return task != null ? ResponseEntity.status(200).body(task) : ResponseEntity.status(404).build();
        }

        public ResponseEntity<Task> createTask(Task task) {
                taskRepository.save(task);
                return ResponseEntity.status(201).body(task);
        }

        public ResponseEntity<Task> patchTask(UUID id, Task task) {
                Task existing = taskRepository.findById(id).orElse(null);
                if (existing == null) {
                        return ResponseEntity.status(404).body(task);
                }
                if (task.getName() != null) {
                        existing.setName(task.getName());
                }
                if (task.getCategory() != null) {
                        existing.setCategory(task.getCategory());
                }
                if (task.getProgress() != null) {
                        existing.setProgress(task.getProgress());
                }
                if (task.getGoal() != null) {
                        existing.setGoal(task.getGoal());
                }
                if (task.getDescription() != null) {
                        existing.setDescription(task.getDescription());
                }
                if (task.getDateUntil() != null) {
                        existing.setDateUntil(task.getDateUntil());
                }
                if (task.getDateCreated() != null) {
                        existing.setDateCreated(task.getDateCreated());
                }
                if (task.getIsFavorite() != null) {
                        existing.setIsFavorite(task.getIsFavorite());
                }
                if (task.getIsArchived() != null) {
                        existing.setIsArchived(task.getIsArchived());
                }

                taskRepository.save(existing);
                return ResponseEntity.status(200).body(existing);
        }

        public ResponseEntity<Task> deleteTask(UUID id) {
                Task task = taskRepository.findById(id).orElse(null);
                if (task == null) {
                        return ResponseEntity.status(404).build();
                }
                if (!task.getIsArchived()) {
                        return ResponseEntity.status(400).body(null);
                }
                taskRepository.deleteById(id);
                return ResponseEntity.status(200).build();
        }

        public ResponseEntity<Task> deleteAllTasks() {
                taskRepository.deleteAll();
                return ResponseEntity.status(200).build();
        }
}