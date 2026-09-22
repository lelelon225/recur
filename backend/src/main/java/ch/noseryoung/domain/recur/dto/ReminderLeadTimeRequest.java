package ch.noseryoung.domain.recur.dto;

import ch.noseryoung.domain.recur.enums.ReminderLeadTime;

// null = Override für diesen User/Task wieder löschen (zurück auf die
// Kontoeinstellung), siehe TaskService.setReminderLeadTime.
public record ReminderLeadTimeRequest(ReminderLeadTime reminderLeadTime) {
}
