package ch.noseryoung.domain.recur.exceptions.group;

import java.util.UUID;

public class ProjectNotFoundException extends RuntimeException {

    public ProjectNotFoundException(UUID id) {
        super("Projekt mit ID " + id + " wurde nicht gefunden");
    }
}
