package ch.noseryoung.domain.recur.exceptions;

public class InvalidPasswordResetTokenException extends RuntimeException {

    public InvalidPasswordResetTokenException() {
        super("Dieser Link ist ungültig oder abgelaufen");
    }
}
