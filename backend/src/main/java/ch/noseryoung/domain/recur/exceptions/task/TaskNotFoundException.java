package ch.noseryoung.domain.recur.exceptions.task;

import java.util.UUID;

public class TaskNotFoundException extends RuntimeException {

    public TaskNotFoundException(UUID id) {
        super("Task mit ID " + id + " wurde nicht gefunden");
    }
}