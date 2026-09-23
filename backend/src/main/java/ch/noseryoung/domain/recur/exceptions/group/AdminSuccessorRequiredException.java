package ch.noseryoung.domain.recur.exceptions.group;

public class AdminSuccessorRequiredException extends RuntimeException {

    public AdminSuccessorRequiredException() {
        super("Als Admin musst du zuerst einen Nachfolger bestimmen, bevor du die Gruppe verlassen kannst");
    }
}
