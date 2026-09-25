package ch.noseryoung.domain.recur.auth.exceptions;

public class InvalidCredentialsException extends RuntimeException {

    public InvalidCredentialsException() {
        super("E-Mail oder Passwort ist falsch");
    }
}