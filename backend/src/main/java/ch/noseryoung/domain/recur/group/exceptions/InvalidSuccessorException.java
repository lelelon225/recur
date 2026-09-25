package ch.noseryoung.domain.recur.group.exceptions;

public class InvalidSuccessorException extends RuntimeException {

    public InvalidSuccessorException() {
        super("Der gewählte Nachfolger ist kein gültiges Mitglied dieser Gruppe");
    }
}
