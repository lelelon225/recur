package ch.noseryoung.domain.recur.group.exceptions;

public class NotGroupMemberException extends RuntimeException {

    public NotGroupMemberException() {
        super("Du bist kein Mitglied dieser Gruppe");
    }
}
