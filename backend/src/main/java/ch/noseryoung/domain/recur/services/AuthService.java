package ch.noseryoung.domain.recur.services;

import java.time.Instant;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import ch.noseryoung.domain.recur.dto.AuthResponse;
import ch.noseryoung.domain.recur.dto.LoginRequest;
import ch.noseryoung.domain.recur.dto.RegisterRequest;
import ch.noseryoung.domain.recur.dto.UserResponse;
import ch.noseryoung.domain.recur.enums.AuthProvider;
import ch.noseryoung.domain.recur.enums.VerificationStatus;
import ch.noseryoung.domain.recur.exceptions.EmailAlreadyExistsException;
import ch.noseryoung.domain.recur.exceptions.InvalidCredentialsException;
import ch.noseryoung.domain.recur.exceptions.InvalidPasswordResetTokenException;
import ch.noseryoung.domain.recur.models.PasswordResetToken;
import ch.noseryoung.domain.recur.models.User;
import ch.noseryoung.domain.recur.models.VerificationToken;
import ch.noseryoung.domain.recur.repositories.NotificationSettingsRepository;
import ch.noseryoung.domain.recur.repositories.PasswordResetTokenRepository;
import ch.noseryoung.domain.recur.repositories.UserPrivacySettingsRepository;
import ch.noseryoung.domain.recur.repositories.UserRepository;
import ch.noseryoung.domain.recur.repositories.VerificationTokenRepository;
import ch.noseryoung.domain.recur.security.JwtService;
import io.jsonwebtoken.JwtException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final UserPrivacySettingsRepository privacySettingsRepository;
    private final NotificationSettingsRepository notificationSettingsRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${app.mail.verification-expiry-hours}")
    private long verificationExpiryHours;

    @Value("${app.mail.resend-cooldown-seconds}")
    private long resendCooldownSeconds;

    @Value("${app.mail.password-reset-expiry-hours}")
    private long passwordResetExpiryHours;

    @Value("${app.mail.password-reset-cooldown-seconds}")
    private long passwordResetCooldownSeconds;

    public AuthService(UserRepository userRepository, UserPrivacySettingsRepository privacySettingsRepository,
            NotificationSettingsRepository notificationSettingsRepository,
            VerificationTokenRepository verificationTokenRepository,
            PasswordResetTokenRepository passwordResetTokenRepository,
            PasswordEncoder passwordEncoder, JwtService jwtService, EmailService emailService) {
        this.userRepository = userRepository;
        this.privacySettingsRepository = privacySettingsRepository;
        this.notificationSettingsRepository = notificationSettingsRepository;
        this.verificationTokenRepository = verificationTokenRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }

    // E-Mail-Verifizierung ist temporär umgangen (#128): die Absenderdomain ist
    // auf der Spamhaus DBL gelistet (#126), Verifizierungs-Mails kommen nie an.
    // Registrierung loggt deshalb wie vor #110 direkt ein statt eine Mail zu
    // verschicken, die niemand je bestätigen könnte. issueVerificationToken
    // bleibt unangetastet für die Reaktivierung nach der Domain-Migration.
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException(request.email());
        }

        User user = User.builder()
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .firstName(request.firstName())
                .lastName(request.lastName())
                .provider(AuthProvider.LOCAL)
                .emailVerified(true)
                .build();

        userRepository.save(user);

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, UserResponse.from(user));
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(InvalidCredentialsException::new);

        // Kein passwordHash -> Konto wurde nur über Google angelegt, es existiert
        // kein lokales Passwort, gegen das geprüft werden könnte.
        if (user.getPasswordHash() == null
                || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }

        // Verifizierungs-Check temporär deaktiviert (#128, siehe register()
        // oben) - erfasst auch Alt-Konten, die vor dieser Änderung registriert
        // wurden und nie eine Verifizierungs-Mail erhalten konnten.

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, UserResponse.from(user));
    }

    public VerificationStatus verifyEmail(String token) {
        VerificationToken verificationToken = verificationTokenRepository.findByToken(token).orElse(null);
        if (verificationToken == null) {
            return VerificationStatus.INVALID;
        }

        if (verificationToken.getExpiresAt().isBefore(Instant.now())) {
            verificationTokenRepository.delete(verificationToken);
            return VerificationStatus.EXPIRED;
        }

        User user = verificationToken.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);
        verificationTokenRepository.delete(verificationToken);

        return VerificationStatus.VERIFIED;
    }

    // Antwortet in jedem Fall mit derselben generischen Message (Controller-Ebene),
    // damit dieser Endpunkt nicht zum Enumerieren registrierter E-Mail-Adressen
    // missbraucht werden kann. Kein Match, bereits verifiziert oder innerhalb der
    // Cooldown-Frist -> no-op.
    public void resendVerification(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null || Boolean.TRUE.equals(user.getEmailVerified())) {
            return;
        }

        boolean withinCooldown = verificationTokenRepository
                .findFirstByUserIdOrderByDateCreatedDesc(user.getId())
                .map(t -> t.getDateCreated().plusSeconds(resendCooldownSeconds).isAfter(Instant.now()))
                .orElse(false);
        if (withinCooldown) {
            return;
        }

        verificationTokenRepository.deleteByUserId(user.getId());
        issueVerificationToken(user);
    }

    private void issueVerificationToken(User user) {
        VerificationToken verificationToken = VerificationToken.builder()
                .token(UUID.randomUUID().toString())
                .user(user)
                .expiresAt(Instant.now().plusSeconds(verificationExpiryHours * 3600))
                .build();
        verificationTokenRepository.save(verificationToken);

        String verificationLink = UriComponentsBuilder.fromUriString(frontendUrl)
                .path("/api/auth/verify-email")
                .queryParam("token", verificationToken.getToken())
                .build()
                .toUriString();

        emailService.sendVerificationEmail(user, verificationLink);
    }

    // Antwortet immer gleich (Controller-Ebene), egal ob das Konto existiert,
    // ein Google-Konto ist (kein passwordHash) oder noch nicht verifiziert ist
    // (keine bestätigte Möglichkeit, den echten Inhaber zu erreichen) -
    // verhindert, dass dieser Endpunkt registrierte E-Mail-Adressen oder deren
    // Login-Methode enumerierbar macht.
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null || user.getProvider() != AuthProvider.LOCAL
                || !Boolean.TRUE.equals(user.getEmailVerified())) {
            return;
        }

        boolean withinCooldown = passwordResetTokenRepository
                .findFirstByUserIdOrderByDateCreatedDesc(user.getId())
                .map(t -> t.getDateCreated().plusSeconds(passwordResetCooldownSeconds).isAfter(Instant.now()))
                .orElse(false);
        if (withinCooldown) {
            return;
        }

        passwordResetTokenRepository.deleteByUserId(user.getId());
        issuePasswordResetToken(user);
    }

    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token).orElse(null);
        if (resetToken == null) {
            throw new InvalidPasswordResetTokenException();
        }

        if (resetToken.getExpiresAt().isBefore(Instant.now())) {
            passwordResetTokenRepository.delete(resetToken);
            throw new InvalidPasswordResetTokenException();
        }

        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        passwordResetTokenRepository.delete(resetToken);
    }

    private void issuePasswordResetToken(User user) {
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(UUID.randomUUID().toString())
                .user(user)
                .expiresAt(Instant.now().plusSeconds(passwordResetExpiryHours * 3600))
                .build();
        passwordResetTokenRepository.save(resetToken);

        String resetLink = UriComponentsBuilder.fromUriString(frontendUrl)
                .path("/reset-password")
                .queryParam("token", resetToken.getToken())
                .build()
                .toUriString();

        emailService.sendPasswordResetEmail(user, resetLink);
    }

    // Tauscht das kurzlebige HttpOnly-Handoff-Cookie (siehe
    // OAuth2AuthenticationSuccessHandler) gegen die gleiche AuthResponse-Form
    // wie beim normalen Login - der Token selbst wird dabei nicht neu
    // ausgestellt, nur validiert und an den Client zurückgegeben.
    public AuthResponse exchangeOAuth2Token(String token) {
        String email;
        try {
            email = jwtService.extractEmail(token);
        } catch (JwtException | IllegalArgumentException e) {
            throw new InvalidCredentialsException();
        }

        if (email == null || !jwtService.isTokenValid(token, email)) {
            throw new InvalidCredentialsException();
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(InvalidCredentialsException::new);

        return new AuthResponse(token, UserResponse.from(user));
    }

    public UserResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Authentifizierter User nicht gefunden: " + email));

        return UserResponse.from(user);
    }

    public UserResponse updateCurrentUser(UserResponse userResponse) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Authentifizierter User nicht gefunden: " + email));


        user.setFirstName(userResponse.firstName());
        user.setLastName(userResponse.lastName());
        user.setAvatarUrl(userResponse.avatarUrl());

        userRepository.save(user);

        return UserResponse.from(user);
    }
    public void deleteCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Authentifizierter User nicht gefunden: " + email));

        // Muss vor dem User gelöscht werden, sonst schlägt der Delete an der
        // FK-Constraint von user_privacy_settings.user_id, notification_settings.user_id,
        // verification_token.user_id bzw. password_reset_token.user_id fehl.
        privacySettingsRepository.findByUserId(user.getId())
                .ifPresent(privacySettingsRepository::delete);
        notificationSettingsRepository.findByUserId(user.getId())
                .ifPresent(notificationSettingsRepository::delete);
        verificationTokenRepository.deleteByUserId(user.getId());
        passwordResetTokenRepository.deleteByUserId(user.getId());

        userRepository.delete(user);
    }

}