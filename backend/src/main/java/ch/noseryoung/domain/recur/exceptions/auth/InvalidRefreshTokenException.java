package ch.noseryoung.domain.recur.exceptions.auth;

public class InvalidRefreshTokenException extends RuntimeException {

    public InvalidRefreshTokenException() {
        super("Sitzung ist ungültig oder abgelaufen");
    }
}
