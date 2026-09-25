package ch.noseryoung.domain.recur.auth.exceptions;

public class EmailAlreadyExistsException extends RuntimeException {

    public EmailAlreadyExistsException(String email) {
        super("Ein Konto mit der E-Mail " + email + " existiert bereits");
    }
}