package ch.noseryoung.domain.recur.controllers;

import ch.noseryoung.domain.recur.models.Task;
import ch.noseryoung.domain.recur.services.TaskService;

import java.util.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/task")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

        private final TaskService taskService;

        public TaskController(TaskService taskService) {
                this.taskService = taskService;
        }

        @GetMapping({ "", "/" })
        public ResponseEntity<Collection<Task>> getTasks() {
                return taskService.getTasks();
        };

        @GetMapping({ "/{id}", "/{id}/" })
        public ResponseEntity<Task> getTask(@PathVariable UUID id) {
                return taskService.getTask(id);
        };

        @GetMapping({ "/favorite", "/favorite/" })
        public ResponseEntity<Collection<Task>> getFavoriteTasks() {
                return taskService.getFavoriteTasks();
        };

        @PostMapping({ "", "/" })
        public ResponseEntity<Task> createTask(@Valid @RequestBody Task task) {
                return taskService.createTask(task);
        };

        @PatchMapping({ "/{id}", "/{id}/" })
        public ResponseEntity<Task> patchTask(@PathVariable UUID id, @Valid @RequestBody Task task) {
                return taskService.patchTask(id, task);
        };

        @DeleteMapping({ "/{id}", "/{id}/" })
        public ResponseEntity<Task> deleteTask(@PathVariable UUID id) {
                return taskService.deleteTask(id);
        };

        @DeleteMapping({ "/all", "/all/" })
        public ResponseEntity<Task> deleteAllTasks() {
                return taskService.deleteAllTasks();
        };
}