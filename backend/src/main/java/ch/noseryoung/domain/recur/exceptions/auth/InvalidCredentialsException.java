package ch.noseryoung.domain.recur.exceptions.auth;

public class InvalidCredentialsException extends RuntimeException {

    public InvalidCredentialsException() {
        super("E-Mail oder Passwort ist falsch");
    }
}