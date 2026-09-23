package ch.noseryoung.domain.recur.exceptions.group;

public class ProjectNotArchivedException extends RuntimeException {

    public ProjectNotArchivedException() {
        super("Projekt muss erst archiviert werden, bevor es gelöscht werden kann");
    }
}
