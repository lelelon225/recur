package ch.noseryoung.domain.recur.services;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import ch.noseryoung.domain.recur.dto.auth.AuthResponse;
import ch.noseryoung.domain.recur.dto.auth.LoginRequest;
import ch.noseryoung.domain.recur.dto.auth.RegisterRequest;
import ch.noseryoung.domain.recur.dto.auth.UserResponse;
import ch.noseryoung.domain.recur.enums.auth.AuthProvider;
import ch.noseryoung.domain.recur.enums.auth.VerificationStatus;
import ch.noseryoung.domain.recur.exceptions.auth.EmailAlreadyExistsException;
import ch.noseryoung.domain.recur.exceptions.auth.InvalidCredentialsException;
import ch.noseryoung.domain.recur.exceptions.auth.InvalidPasswordResetTokenException;
import ch.noseryoung.domain.recur.models.auth.PasswordResetToken;
import ch.noseryoung.domain.recur.models.User;
import ch.noseryoung.domain.recur.models.auth.VerificationToken;
import ch.noseryoung.domain.recur.task.model.Task;
import ch.noseryoung.domain.recur.repositories.notification.NotificationSettingsRepository;
import ch.noseryoung.domain.recur.repositories.auth.PasswordResetTokenRepository;
import ch.noseryoung.domain.recur.task.repository.TaskRepository;
import ch.noseryoung.domain.recur.repositories.UserPrivacySettingsRepository;
import ch.noseryoung.domain.recur.repositories.UserRepository;
import ch.noseryoung.domain.recur.repositories.auth.VerificationTokenRepository;
import ch.noseryoung.domain.recur.security.jwt.JwtService;
import ch.noseryoung.domain.recur.security.jwt.RefreshTokenService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.HttpServletRequest;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final UserPrivacySettingsRepository privacySettingsRepository;
    private final NotificationSettingsRepository notificationSettingsRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final TaskRepository taskRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final EmailService emailService;

    // Bündelt die AuthResponse (User, geht in den Response-Body) mit dem rohen
    // Access- und Refresh-Token (beide gehen als HttpOnly-Cookies raus, #160) -
    // der Controller baut daraus die Set-Cookie-Header, der Service kennt keine
    // HTTP-Response.
    public record AuthResult(AuthResponse authResponse, String accessToken, String refreshToken) {
    }

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
            TaskRepository taskRepository,
            PasswordEncoder passwordEncoder, JwtService jwtService, RefreshTokenService refreshTokenService,
            EmailService emailService) {
        this.userRepository = userRepository;
        this.privacySettingsRepository = privacySettingsRepository;
        this.notificationSettingsRepository = notificationSettingsRepository;
        this.verificationTokenRepository = verificationTokenRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.taskRepository = taskRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.emailService = emailService;
    }

    // E-Mail-Verifizierung ist temporär umgangen (#128): die Absenderdomain ist
    // auf der Spamhaus DBL gelistet (#126), Verifizierungs-Mails kommen nie an.
    // Registrierung loggt deshalb wie vor #110 direkt ein statt eine Mail zu
    // verschicken, die niemand je bestätigen könnte. issueVerificationToken
    // bleibt unangetastet für die Reaktivierung nach der Domain-Migration.
    public AuthResult register(RegisterRequest request, HttpServletRequest httpRequest) {
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

        return authResult(user, httpRequest);
    }

    public AuthResult login(LoginRequest request, HttpServletRequest httpRequest) {
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

        return authResult(user, httpRequest);
    }

    // Rotiert das Refresh-Token (siehe RefreshTokenService#rotate) und stellt
    // einen frischen Access-Token für denselben User aus.
    public AuthResult refresh(String refreshToken, HttpServletRequest httpRequest) {
        RefreshTokenService.RotationResult rotation = refreshTokenService.rotate(refreshToken, httpRequest);
        String token = jwtService.generateToken(rotation.user());
        return new AuthResult(new AuthResponse(UserResponse.from(rotation.user())), token, rotation.rawToken());
    }

    private AuthResult authResult(User user, HttpServletRequest httpRequest) {
        String token = jwtService.generateToken(user);
        String refreshToken = refreshTokenService.issue(user, httpRequest);
        return new AuthResult(new AuthResponse(UserResponse.from(user)), token, refreshToken);
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
    // ausgestellt, nur validiert; der Controller setzt ihn als Access-Token-
    // Cookie (#160).
    public record TokenExchangeResult(AuthResponse authResponse, String accessToken) {
    }

    public TokenExchangeResult exchangeOAuth2Token(String token) {
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

        return new TokenExchangeResult(new AuthResponse(UserResponse.from(user)), token);
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
        refreshTokenService.deleteAllForUser(user.getId());

        // Projekt-Tasks, die der User erstellt oder für sich ausgeblendet hat
        // (siehe TaskService#deleteTask), referenzieren ihn per FK -
        // taskRepository.delete(user) allein würde sonst an genau dieser
        // Constraint scheitern. Der Task selbst bleibt für die übrigen
        // Mitglieder bestehen (createdBy=null -> Fallback auf den
        // Gruppen-Admin, siehe TaskService#isTaskCreator).
        taskRepository.clearCreatedBy(user);
        List<Task> hiddenTasks = taskRepository.findByHiddenForContaining(user);
        hiddenTasks.forEach(task -> task.getHiddenFor().remove(user));
        taskRepository.saveAll(hiddenTasks);

        userRepository.delete(user);
    }

}