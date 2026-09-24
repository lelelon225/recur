package ch.noseryoung.domain.recur.auth.exceptions;

public class InvalidRefreshTokenException extends RuntimeException {

    public InvalidRefreshTokenException() {
        super("Sitzung ist ungültig oder abgelaufen");
    }
}
