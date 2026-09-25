package ch.noseryoung.domain.recur.auth.exceptions;

public class InvalidPasswordResetTokenException extends RuntimeException {

    public InvalidPasswordResetTokenException() {
        super("Dieser Link ist ungültig oder abgelaufen");
    }
}
