package ch.noseryoung.domain.recur.controllers;

import ch.noseryoung.domain.recur.dto.CreateTaskRequest;
import ch.noseryoung.domain.recur.dto.PatchTaskRequest;
import ch.noseryoung.domain.recur.dto.ReminderLeadTimeRequest;
import ch.noseryoung.domain.recur.models.Task;
import ch.noseryoung.domain.recur.services.TaskService;

import java.time.LocalDate;
import java.util.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/task")
@CrossOrigin(origins = "${app.cors.allowed-origin}")
@Validated
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
        public ResponseEntity<Task> createTask(@Valid @RequestBody CreateTaskRequest request) {
                return taskService.createTask(request);
        };

        // Alle Felder auf PatchTaskRequest sind optional (null = nicht ändern),
        // deshalb reicht hier @Valid ohne eigene Validation-Group. amountDid bleibt
        // hier (statt auf die Completion-Endpoints unten umgestellt) für geteilte
        // Projekt-Tasks bestehen, die bewusst ausserhalb von #152 liegen (siehe
        // TaskService#addCompletion/removeCompletion, nur für persönliche Tasks).
        @PatchMapping({ "/{id}", "/{id}/" })
        public ResponseEntity<Task> patchTask(@PathVariable UUID id, @Valid @RequestBody PatchTaskRequest request,
                        @RequestParam(required = false) Boolean resetProgress,
                        @RequestParam(required = false) Boolean favorite,
                        @RequestParam(required = false) Boolean archived,
                        @RequestParam(required = false) @Min(0) @Max(1_000_000) Integer amountDid,
                        @RequestParam(required = false) Boolean unassignProject) {
                return taskService.patchTask(id, request, resetProgress, favorite, archived, amountDid, unassignProject);
        }

        // Nachträgliches Abhaken/Rückgängig eines einzelnen Tages für persönliche
        // Tasks (#152) - eigene Endpoints statt PATCH-Query-Params, da hier (anders
        // als amountDid) Backend-seitig echte Konflikt-/Datums-Validierung nötig ist.
        @PutMapping({ "/{id}/completions/{date}", "/{id}/completions/{date}/" })
        public ResponseEntity<Task> addCompletion(@PathVariable UUID id,
                        @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
                return taskService.addCompletion(id, date);
        }

        @DeleteMapping({ "/{id}/completions/{date}", "/{id}/completions/{date}/" })
        public ResponseEntity<Task> removeCompletion(@PathVariable UUID id,
                        @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
                return taskService.removeCompletion(id, date);
        }

        @PostMapping({ "/{id}/assign", "/{id}/assign/" })
        public ResponseEntity<Task> assignSelf(@PathVariable UUID id) {
                return taskService.assignSelf(id);
        }

        @PostMapping({ "/{id}/unassign", "/{id}/unassign/" })
        public ResponseEntity<Task> unassignSelf(@PathVariable UUID id) {
                return taskService.unassignSelf(id);
        }

        // Erinnerungs-Vorlauf-Override des aktuellen Users für diesen Task
        // (#102-Follow-up) - pro (task, user), nicht Teil von PatchTaskRequest,
        // siehe TaskService#setReminderLeadTime.
        @PutMapping({ "/{id}/reminder-lead-time", "/{id}/reminder-lead-time/" })
        public ResponseEntity<Task> setReminderLeadTime(@PathVariable UUID id,
                        @RequestBody ReminderLeadTimeRequest request) {
                return taskService.setReminderLeadTime(id, request.reminderLeadTime());
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