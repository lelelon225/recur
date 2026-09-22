package ch.noseryoung.domain.recur.dto;

import java.time.Instant;

import ch.noseryoung.domain.recur.enums.Category;
import ch.noseryoung.domain.recur.enums.Frequency;
import ch.noseryoung.domain.recur.enums.ReminderLeadTime;
import jakarta.validation.constraints.Size;

// Alle Felder optional: null bedeutet "nicht ändern", passend zu
// TaskService.patchTask()'s partiellem Update-Verhalten.
public record PatchTaskRequest(
                @Size(min = 2, max = 40, message = "Name muss zwischen 2 und 40 Zeichen lang sein") String name,

                Category category,

                Frequency frequency,

                @Size(max = 200, message = "Beschreibung darf maximal 200 Zeichen lang sein") String description,

                Instant dateUntil,

                Integer durationMinutes,

                Instant startTime,

                // Wie bei den übrigen Feldern: null = nicht ändern. Ein einmal
                // gesetzter Override kann daher aktuell nicht wieder auf "Konto-
                // Standard" zurückgesetzt werden - gleiche Einschränkung wie z.B.
                // bei durationMinutes.
                ReminderLeadTime reminderLeadTime,

                Boolean isFavorite,

                Boolean isArchived,

                ProjectReference project) {
}
