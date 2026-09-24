package ch.noseryoung.domain.recur.services.notification;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import ch.noseryoung.domain.recur.dto.notification.NotificationSettingsResponse;
import ch.noseryoung.domain.recur.models.notification.NotificationSettings;
import ch.noseryoung.domain.recur.auth.model.User;
import ch.noseryoung.domain.recur.repositories.notification.NotificationSettingsRepository;
import ch.noseryoung.domain.recur.auth.repository.UserRepository;

@Service
public class NotificationSettingsService {

    private final UserRepository userRepository;
    private final NotificationSettingsRepository notificationSettingsRepository;

    public NotificationSettingsService(UserRepository userRepository,
            NotificationSettingsRepository notificationSettingsRepository) {
        this.userRepository = userRepository;
        this.notificationSettingsRepository = notificationSettingsRepository;
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Authentifizierter User nicht gefunden: " + email));
    }

    // Nutzer, die vor Einführung dieser Einstellungen registriert wurden, haben
    // noch keine NotificationSettings-Zeile - beim ersten Zugriff wird sie mit
    // den Standardwerten angelegt, statt eine Migration für Bestandsnutzer zu
    // brauchen.
    private NotificationSettings getOrCreateSettings(User user) {
        return notificationSettingsRepository.findByUserId(user.getId())
                .orElseGet(() -> notificationSettingsRepository.save(
                        NotificationSettings.builder().user(user).build()));
    }

    public NotificationSettingsResponse getCurrentSettings() {
        User user = getCurrentUser();
        return NotificationSettingsResponse.from(getOrCreateSettings(user));
    }

    public NotificationSettingsResponse updateCurrentSettings(NotificationSettingsResponse update) {
        User user = getCurrentUser();
        NotificationSettings settings = getOrCreateSettings(user);

        if (update.emailEnabled() != null) {
            settings.setEmailEnabled(update.emailEnabled());
        }
        if (update.pushEnabled() != null) {
            settings.setPushEnabled(update.pushEnabled());
        }
        if (update.reminderLeadTime() != null) {
            settings.setReminderLeadTime(update.reminderLeadTime());
        }

        notificationSettingsRepository.save(settings);

        return NotificationSettingsResponse.from(settings);
    }
}
