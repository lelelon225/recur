package ch.noseryoung.domain.recur.exceptions;

public class EmailAlreadyExistsException extends RuntimeException {

    public EmailAlreadyExistsException(String email) {
        super("Ein Konto mit der E-Mail " + email + " existiert bereits");
    }
}