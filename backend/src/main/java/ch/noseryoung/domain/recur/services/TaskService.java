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
                Task existingTask = taskRepository.findById(id).orElse(null);
                if (existingTask == null) {
                        return ResponseEntity.status(404).build();
                }
                task.setId(id);
                taskRepository.save(task);
                return ResponseEntity.status(200).body(task);
        }

        public ResponseEntity<Task> deleteTask(UUID id) {
                Task task = taskRepository.findById(id).orElse(null);
                if (task == null) {
                        return ResponseEntity.status(404).build();
                }
                for (Task t : taskRepository.findByIsArchived(true)) {
                        if (t.getId().equals(id)) {
                                return ResponseEntity.status(403).build();
                        }
                }
                taskRepository.deleteById(id);
                return ResponseEntity.status(200).build();
        }

        public ResponseEntity<Task> deleteAllTasks() {
                taskRepository.deleteAll();
                return ResponseEntity.status(200).build();
        }

        public ResponseEntity<Collection<Task>> getArchivedTasks() {
                Collection<Task> tasks = taskRepository.findByIsArchived(true);
                return ResponseEntity.status(200).body(tasks);
        }

        public ResponseEntity<Collection<Task>> getFavoriteTasks() {
                Collection<Task> tasks = taskRepository.findByIsFavorite(true);
                return ResponseEntity.status(200).body(tasks);
        }
}