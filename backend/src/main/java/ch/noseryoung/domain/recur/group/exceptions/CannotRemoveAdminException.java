package ch.noseryoung.domain.recur.group.exceptions;

public class CannotRemoveAdminException extends RuntimeException {

    public CannotRemoveAdminException() {
        super("Der Admin kann nicht entfernt werden - zuerst die Adminrolle übertragen");
    }
}
