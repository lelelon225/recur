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
        public ResponseEntity<Collection<Task>> getTasks(@RequestParam(required = false) Boolean archived,
                        @RequestParam(required = false) Boolean favorite) {
                return taskService.getTasks(archived, favorite);
        };

        @GetMapping({ "/{id}", "/{id}/" })
        public ResponseEntity<Task> getTask(@PathVariable UUID id) {
                return taskService.getTask(id);
        };

        @PostMapping({ "", "/" })
        public ResponseEntity<Task> createTask(@Valid @RequestBody Task task) {
                return taskService.createTask(task);
        };

        @PatchMapping({ "/{id}", "/{id}/" })
        public ResponseEntity<Task> patchTask(@PathVariable UUID id, @Valid @RequestBody Task task,
                        @RequestParam(required = false) Boolean resetProgress,
                        @RequestParam(required = false) Boolean favorite,
                        @RequestParam(required = false) Boolean archived,
                        @RequestParam(required = false) Integer amountDid) {
                return taskService.patchTask(id, task, resetProgress, favorite, archived, amountDid);
        }

        @DeleteMapping({ "/{id}", "/{id}/" })
        public ResponseEntity<Task> deleteTask(@PathVariable UUID id) {
                return taskService.deleteTask(id);
        }

        @DeleteMapping({ "", "/" })
        public ResponseEntity<Task> deleteAllTasks() {
                return taskService.deleteAllTasks();
        }
}