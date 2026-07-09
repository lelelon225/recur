package ch.noseryoung.domain.recur.utils;

import org.springframework.stereotype.Component;

import ch.noseryoung.domain.recur.enums.Frequency;
import ch.noseryoung.domain.recur.models.Task;

import java.time.Duration;
import java.util.EnumMap;

@Component
public class TaskUtil {

    private EnumMap<Frequency, Integer> frequencies = new EnumMap<>(Frequency.class);

    public TaskUtil() {
        frequencies.put(Frequency.DAILY, 1);
        frequencies.put(Frequency.WEEKLY, 7);
        frequencies.put(Frequency.MONTHLY, 30);
        frequencies.put(Frequency.YEARLY, 365);
    }

    public Integer getFrequencyNumber(Frequency frequency) {
        return frequencies.get(frequency);
    }

    public static void calculateDaysInSpan(Task task) {
        if (task.getDateUntil() != null && task.getDateCreated() != null) {
            long daysBetween = Duration.between(task.getDateCreated(), task.getDateUntil()).toDays();
            task.setDaysInSpan((int) daysBetween);
        }
    }

    /**
     * Berechnet den Progress basierend auf der Gesamt-Zeitspanne (daysInSpan)
     * und der Frequenz, NICHT auf verstrichener Zeit.
     * progress = amountDid / (daysInSpan / intervalDays) * 100
     *
     * Jeder Klick auf "abhaken" steigert den Progress um einen fixen Betrag
     * (bei 10 Tagen daily z.B. immer +10%), unabhängig davon an welchem Tag
     * der Task-Laufzeit man sich befindet.
     */
    public void calculateProgress(Task task) {
        if (task.getAmountDid() == null || task.getFrequency() == null || task.getDaysInSpan() == null
                || task.getDaysInSpan() <= 0) {
            task.setProgress(0.0);
            return;
        }

        Integer intervalDays = getFrequencyNumber(task.getFrequency());
        if (intervalDays == null || intervalDays <= 0) {
            task.setProgress(0.0);
            return;
        }

        double expectedRepsTotal = (double) task.getDaysInSpan() / intervalDays;
        double progress = (task.getAmountDid() / expectedRepsTotal) * 100.0;

        task.setProgress(progress);
    }
}