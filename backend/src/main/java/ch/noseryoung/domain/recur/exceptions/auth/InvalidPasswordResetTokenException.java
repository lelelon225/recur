package ch.noseryoung.domain.recur.exceptions.auth;

public class InvalidPasswordResetTokenException extends RuntimeException {

    public InvalidPasswordResetTokenException() {
        super("Dieser Link ist ungültig oder abgelaufen");
    }
}
