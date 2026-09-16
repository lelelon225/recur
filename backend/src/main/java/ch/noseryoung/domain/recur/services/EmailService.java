package ch.noseryoung.domain.recur.services;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import ch.noseryoung.domain.recur.models.User;

@Service
public class EmailService {

    private static final Logger logger = LogManager.getLogger(EmailService.class);

    private final RestClient restClient;

    @Value("${app.mail.from}")
    private String from;

    public EmailService(@Value("${app.mail.brevo-api-key}") String apiKey) {
        this.restClient = RestClient.builder()
                .baseUrl("https://api.brevo.com/v3/smtp/email")
                .defaultHeader("api-key", apiKey)
                .defaultHeader("accept", "application/json")
                .build();
    }

    // Ein Ausfall des Brevo-API-Aufrufs darf die Registrierung nicht mit einem
    // 500 scheitern lassen - der User-Datensatz ist zu diesem Zeitpunkt bereits
    // gespeichert, ein erneuter Versuch würde nur auf EmailAlreadyExistsException
    // laufen. Der Nutzer kann die E-Mail stattdessen über "erneut senden"
    // anfordern. Der Link wird zusätzlich auf DEBUG geloggt, damit die
    // Verifizierung auch lokal ohne Brevo-API-Key testbar ist.
    public void sendVerificationEmail(User user, String verificationLink) {
        logger.debug("Verification link for {}: {}", user.getEmail(), verificationLink);

        trySend(user.getEmail(), "Bestätige deine E-Mail-Adresse bei Recur",
                "Hallo " + user.getFirstName() + ",\n\n"
                        + "bitte bestätige deine E-Mail-Adresse, indem du auf den folgenden Link klickst:\n\n"
                        + verificationLink + "\n\n"
                        + "Dieser Link ist 24 Stunden gültig.\n\n"
                        + "Falls du dich nicht bei Recur registriert hast, kannst du diese E-Mail ignorieren.");
    }

    public void sendPasswordResetEmail(User user, String resetLink) {
        logger.debug("Password reset link for {}: {}", user.getEmail(), resetLink);

        trySend(user.getEmail(), "Setze dein Passwort bei Recur zurück",
                "Hallo " + user.getFirstName() + ",\n\n"
                        + "du hast angefordert, dein Passwort zurückzusetzen. Klicke auf den folgenden Link, "
                        + "um ein neues Passwort zu vergeben:\n\n"
                        + resetLink + "\n\n"
                        + "Dieser Link ist 1 Stunde gültig.\n\n"
                        + "Falls du kein neues Passwort angefordert hast, kannst du diese E-Mail ignorieren "
                        + "- dein Passwort bleibt unverändert.");
    }

    public void sendWelcomeEmail(User user) {
        trySend(user.getEmail(), "Willkommen bei Recur",
                "Hallo " + user.getFirstName() + ",\n\n"
                        + "willkommen bei Recur! Dein Konto wurde erfolgreich über Google erstellt.");
    }

    private void trySend(String to, String subject, String text) {
        BrevoEmailRequest request = new BrevoEmailRequest(
                new BrevoEmailRequest.Sender(from),
                List.of(new BrevoEmailRequest.Recipient(to)),
                subject,
                text);

        try {
            restClient.post()
                    .body(request)
                    .retrieve()
                    .toBodilessEntity();
        } catch (RestClientException e) {
            logger.error("Failed to send email to {}", to, e);
        }
    }

    private record BrevoEmailRequest(Sender sender, List<Recipient> to, String subject, String textContent) {
        private record Sender(String email) {
        }

        private record Recipient(String email) {
        }
    }
}
