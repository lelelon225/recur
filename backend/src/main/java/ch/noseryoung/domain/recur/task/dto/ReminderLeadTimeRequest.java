package ch.noseryoung.domain.recur.task.dto;

import ch.noseryoung.domain.recur.notification.enums.ReminderLeadTime;

// null = Override für diesen User/Task wieder löschen (zurück auf die
// Kontoeinstellung), siehe TaskService.setReminderLeadTime.
public record ReminderLeadTimeRequest(ReminderLeadTime reminderLeadTime) {
}
