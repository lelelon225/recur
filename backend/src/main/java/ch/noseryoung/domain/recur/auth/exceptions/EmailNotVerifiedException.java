package ch.noseryoung.domain.recur.auth.exceptions;

public class EmailNotVerifiedException extends RuntimeException {

    public EmailNotVerifiedException() {
        super("Bitte bestätige zuerst deine E-Mail-Adresse");
    }
}
