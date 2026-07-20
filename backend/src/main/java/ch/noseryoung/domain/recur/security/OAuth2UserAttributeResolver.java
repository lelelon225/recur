package ch.noseryoung.domain.recur.security;

import java.util.Map;

import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.stereotype.Component;

import ch.noseryoung.domain.recur.enums.AuthProvider;
import ch.noseryoung.domain.recur.models.User;
import ch.noseryoung.domain.recur.repositories.UserRepository;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2UserAttributeResolver {

    private final UserRepository userRepository;

    public User resolve(Map<String, Object> attributes) {
        String email = (String) attributes.get("email");
        String firstName = (String) attributes.get("given_name");
        String lastName = (String) attributes.get("family_name");
        String avatarUrl = (String) attributes.get("picture");
        String fullName = (String) attributes.get("name");

        if (email == null || email.isBlank()) {
            throw new OAuth2AuthenticationException(
                    "Google Account besitzt keine Email-Adresse");
        }

        if (firstName == null || firstName.isBlank()) {
            if (fullName != null && !fullName.isBlank()) {
                firstName = fullName.split(" ")[0];
            } else {
                firstName = "Google";
            }
        }

        if (lastName == null || lastName.isBlank()) {
            if (fullName != null && fullName.contains(" ")) {
                String[] parts = fullName.split(" ");
                if (parts.length > 1) {
                    lastName = parts[parts.length - 1];
                }
            }
            if (lastName == null || lastName.isBlank()) {
                lastName = "User";
            }
        }

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> User.builder()
                        .email(email)
                        .provider(AuthProvider.GOOGLE)
                        .enabled(true)
                        .build());

        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setAvatarUrl(avatarUrl);
        user.setProvider(AuthProvider.GOOGLE);
        user.setEnabled(true);

        return userRepository.save(user);
    }
}