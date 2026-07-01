package ch.noseryoung.domain.recur.utils;

import ch.noseryoung.domain.recur.models.Task;
import ch.noseryoung.domain.recur.Enum.Frequency;

import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;

public class TaskUtil {

    private HashMap<Frequency, Integer> frequencies = new HashMap<>();

    public TaskUtil() {
        frequencies.put(Frequency.DAILY, 1);
        frequencies.put(Frequency.WEEKLY, 7);
        frequencies.put(Frequency.MONTHLY, 30);
        frequencies.put(Frequency.YEARLY, 365);
    }

    public Integer getFrequencyNumber(Frequency frequency) {
        return frequencies.get(frequency);
    }

    public static boolean isTaskValid(String name, String description, Integer daysInSpan, Integer amountDid) {
        return name != null && !name.isEmpty() &&
                description != null && !description.isEmpty() &&
                daysInSpan != null && daysInSpan > 0 &&
                amountDid != null && amountDid >= 0;
    }

    public static void calculateDaysInSpan(Task task) {
        if (task.getDateUntil() != null && task.getDateCreated() != null) {
            long daysBetween = Duration.between(task.getDateCreated(), task.getDateUntil()).toDays();
            task.setDaysInSpan((int) daysBetween);
        }
    }

    /**
     * Berechnet den Progress basierend auf verstrichener Zeit im Vergleich zum
     * Frequenz-Intervall.
     * progress = (tatsächliche Erledigungen) / (erwartete Erledigungen bis jetzt) *
     * 100
     */
    public void calculateProgress(Task task) {
        calculateProgress(task, Instant.now());
    }

    // Overload mit "now" als Parameter, damit man's einfach testen kann
    public void calculateProgress(Task task, Instant now) {
        if (task.getAmountDid() == null || task.getFrequency() == null || task.getDateCreated() == null) {
            task.setProgress(0.0);
            return;
        }

        Integer intervalDays = getFrequencyNumber(task.getFrequency());
        if (intervalDays == null || intervalDays <= 0) {
            task.setProgress(0.0);
            return;
        }

        long elapsedDays = Duration.between(task.getDateCreated(), now).toDays();

        // Nicht über die Gesamtdauer der Task hinaus rechnen
        if (task.getDaysInSpan() != null && task.getDaysInSpan() > 0) {
            elapsedDays = Math.min(elapsedDays, task.getDaysInSpan());
        }
        elapsedDays = Math.max(elapsedDays, 0);

        double expectedRepsSoFar = (double) elapsedDays / intervalDays;

        double progress;
        if (expectedRepsSoFar <= 0) {
            // Task ist praktisch gerade erst gestartet -> noch nichts erwartet
            progress = task.getAmountDid() > 0 ? 100.0 : 0.0;
        } else {
            progress = (task.getAmountDid() / expectedRepsSoFar) * 100.0;
        }

        task.setProgress(progress);
    }

}