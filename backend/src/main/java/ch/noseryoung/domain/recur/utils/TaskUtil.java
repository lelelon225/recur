package ch.noseryoung.domain.recur.utils;

import org.springframework.stereotype.Component;

import ch.noseryoung.domain.recur.enums.task.Frequency;
import ch.noseryoung.domain.recur.models.task.Task;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
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
        if (task.getAmountDid() == null || task.getFrequency() == null) {
            task.setProgress(0.0);
            return;
        }

        // Einmalige Termine haben keine Wiederholungs-Intervalltage (nicht in
        // `frequencies` enthalten) und lassen sich daher nicht als Bruchteil
        // erwarteter Wiederholungen berechnen: hier zählt nur erledigt/nicht.
        // Unabhängig von daysInSpan, da ein ONCE-Task (z.B. Start- und
        // Fälligkeitsdatum am selben Tag) sonst durch die daysInSpan<=0-Guard
        // faelschlicherweise auf 0% zurückfaellt.
        if (task.getFrequency() == Frequency.ONCE) {
            task.setProgress(task.getAmountDid() > 0 ? 100.0 : 0.0);
            return;
        }

        if (task.getDaysInSpan() == null || task.getDaysInSpan() <= 0) {
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

    /**
     * Bestandstasks von vor #152 kennen nur den alten amountDid-Zähler, kein
     * Completion-Set. Übersetzt diesen einmalig lazy in synthetische, je 1
     * Intervall auseinanderliegende Completions, damit ihr Fortschritt beim
     * ersten Aufruf nicht auf 0 zurückfällt. No-op sobald das Set mindestens
     * eine echte Completion enthält - MUSS daher vor jeder Mutation des Sets
     * aufgerufen werden (nicht danach: sonst hielte ein zwischenzeitlich auf
     * 0 geleertes Set das alte, noch nicht nachgezogene amountDid für "zu
     * migrierende Historie" und würde eine gerade entfernte Completion sofort
     * wieder zurückschreiben).
     */
    public void backfillLegacyCompletionsIfNeeded(Task task) {
        if (!task.getCompletions().isEmpty()) {
            return;
        }
        backfillLegacyCompletions(task);
    }

    /** Leitet amountDid/lastAmountDidAt unbedingt aus dem aktuellen Completion-Set ab (#152), inkl. Zurücksetzen auf 0/null wenn leer. */
    public void deriveFromCompletions(Task task) {
        task.setAmountDid(task.getCompletions().size());
        task.setLastAmountDidAt(
                task.getCompletions().stream()
                        .max(Comparator.naturalOrder())
                        .map(date -> date.atStartOfDay(ZoneOffset.UTC).toInstant())
                        .orElse(null));
    }

    /** Convenience für reine Lesepfade: Backfill (falls nötig) + Ableitung in einem Schritt. */
    public void syncCompletions(Task task) {
        backfillLegacyCompletionsIfNeeded(task);
        deriveFromCompletions(task);
    }

    private void backfillLegacyCompletions(Task task) {
        if (task.getAmountDid() == null || task.getAmountDid() <= 0) {
            return;
        }

        Instant anchor = task.getLastAmountDidAt() != null ? task.getLastAmountDidAt() : task.getDateCreated();
        LocalDate anchorDate = anchor != null
                ? anchor.atZone(ZoneOffset.UTC).toLocalDate()
                : LocalDate.now(ZoneOffset.UTC);

        if (task.getFrequency() == Frequency.ONCE) {
            task.getCompletions().add(anchorDate);
            return;
        }

        Integer intervalDays = getFrequencyNumber(task.getFrequency());
        if (intervalDays == null) {
            return;
        }

        for (int i = 0; i < task.getAmountDid(); i++) {
            task.getCompletions().add(anchorDate.minusDays((long) i * intervalDays));
        }
    }

    /**
     * Welches Frequenz-Intervall (gezählt seit dateCreated) ein Datum
     * abdeckt - Basis für die Regel "max. 1 Completion pro Intervall" (#152).
     * null bei ONCE oder fehlender Frequenz/dateCreated (kein Intervall-
     * Konzept dort).
     */
    public Long intervalIndexOf(Task task, LocalDate date) {
        Integer intervalDays = getFrequencyNumber(task.getFrequency());
        if (intervalDays == null || task.getDateCreated() == null) {
            return null;
        }

        LocalDate createdDate = task.getDateCreated().atZone(ZoneOffset.UTC).toLocalDate();
        return Math.floorDiv(ChronoUnit.DAYS.between(createdDate, date), intervalDays);
    }
}