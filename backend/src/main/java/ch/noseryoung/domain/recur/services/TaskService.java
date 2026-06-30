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
        };

        public ResponseEntity<Task> getTask(UUID id) {
                Task task = taskRepository.findById(id).orElse(null);
                return task != null ? ResponseEntity.status(200).body(task) : ResponseEntity.status(404).build();
        };

        public ResponseEntity<Task> createTask(Task task) {
                taskRepository.save(task);
                return ResponseEntity.status(201).body(task);
        };

        public ResponseEntity<Task> patchTask(UUID id, Task task) {
                if (!taskRepository.existsById(id)) {
                        return ResponseEntity.status(404).body(task);
                }
                ;
                task.setId(id);
                taskRepository.save(task);
                return ResponseEntity.status(200).body(task);
        };

        public ResponseEntity<Task> deleteTask(UUID id) {
                if (!taskRepository.existsById(id)) {
                        return ResponseEntity.status(404).build();
                }
                ;
                taskRepository.deleteById(id);
                return ResponseEntity.status(200).build();
        };

        public ResponseEntity<Task> deleteAllTasks() {
                taskRepository.deleteAll();
                return ResponseEntity.status(200).build();
        };
}