package ch.noseryoung.domain.recur.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import ch.noseryoung.domain.recur.dto.AuthResponse;
import ch.noseryoung.domain.recur.dto.LoginRequest;
import ch.noseryoung.domain.recur.dto.RegisterRequest;
import ch.noseryoung.domain.recur.enums.AuthProvider;
import ch.noseryoung.domain.recur.exceptions.EmailAlreadyExistsException;
import ch.noseryoung.domain.recur.exceptions.InvalidCredentialsException;
import ch.noseryoung.domain.recur.models.User;
import ch.noseryoung.domain.recur.repositories.UserRepository;
import ch.noseryoung.domain.recur.security.JwtService;

/**
 * Deckt Registrierung und Login ab - die sicherheitskritischen Einstiegspunkte
 * der Authentifizierung (Passwort-Hashing, Duplikat-Check,
 * OAuth-only-Konten ohne lokales Passwort, Token-Ausstellung).
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    private AuthService authService;

    @org.junit.jupiter.api.BeforeEach
    void setUp() {
        authService = new AuthService(userRepository, passwordEncoder, jwtService);
    }

    @Test
    void register_rejectsAlreadyRegisteredEmail() {
        when(userRepository.existsByEmail("taken@example.com")).thenReturn(true);
        RegisterRequest request = new RegisterRequest("taken@example.com", "password123", "Ada", "Lovelace");

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(EmailAlreadyExistsException.class);

        verify(userRepository, never()).save(any());
    }

    @Test
    void register_hashesPasswordAndReturnsToken() {
        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashed-password");
        when(jwtService.generateToken(any(User.class))).thenReturn("jwt-token");
        RegisterRequest request = new RegisterRequest("new@example.com", "password123", "Ada", "Lovelace");

        AuthResponse response = authService.register(request);

        assertThat(response.token()).isEqualTo("jwt-token");
        assertThat(response.user().email()).isEqualTo("new@example.com");

        var userCaptor = org.mockito.ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();
        assertThat(savedUser.getPasswordHash()).isEqualTo("hashed-password");
        assertThat(savedUser.getProvider()).isEqualTo(AuthProvider.LOCAL);
    }

    @Test
    void login_rejectsUnknownEmail() {
        when(userRepository.findByEmail("ghost@example.com")).thenReturn(java.util.Optional.empty());
        LoginRequest request = new LoginRequest("ghost@example.com", "whatever");

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(InvalidCredentialsException.class);
    }

    @Test
    void login_rejectsOAuthOnlyAccountWithoutLocalPassword() {
        User googleUser = User.builder()
                .email("google@example.com")
                .passwordHash(null)
                .provider(AuthProvider.GOOGLE)
                .build();
        when(userRepository.findByEmail("google@example.com")).thenReturn(java.util.Optional.of(googleUser));
        LoginRequest request = new LoginRequest("google@example.com", "anyPassword");

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(InvalidCredentialsException.class);

        verify(passwordEncoder, never()).matches(anyString(), anyString());
    }

    @Test
    void login_rejectsWrongPassword() {
        User user = User.builder().email("user@example.com").passwordHash("hashed").build();
        when(userRepository.findByEmail("user@example.com")).thenReturn(java.util.Optional.of(user));
        when(passwordEncoder.matches("wrong", "hashed")).thenReturn(false);
        LoginRequest request = new LoginRequest("user@example.com", "wrong");

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(InvalidCredentialsException.class);
    }

    @Test
    void login_succeedsWithCorrectPasswordAndReturnsToken() {
        User user = User.builder().email("user@example.com").passwordHash("hashed").build();
        when(userRepository.findByEmail("user@example.com")).thenReturn(java.util.Optional.of(user));
        when(passwordEncoder.matches("correct", "hashed")).thenReturn(true);
        when(jwtService.generateToken(user)).thenReturn("jwt-token");
        LoginRequest request = new LoginRequest("user@example.com", "correct");

        AuthResponse response = authService.login(request);

        assertThat(response.token()).isEqualTo("jwt-token");
        assertThat(response.user().email()).isEqualTo("user@example.com");
    }
}
