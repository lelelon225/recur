package ch.noseryoung.domain.recur.security;

import java.util.Map;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ch.noseryoung.domain.recur.enums.AuthProvider;
import ch.noseryoung.domain.recur.models.User;
import ch.noseryoung.domain.recur.repositories.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest)
            throws OAuth2AuthenticationException {

        OAuth2User oauthUser = super.loadUser(userRequest);

        Map<String, Object> attributes = oauthUser.getAttributes();

        String email = (String) attributes.get("email");
        String firstName = (String) attributes.get("given_name");
        String lastName = (String) attributes.get("family_name");
        String avatarUrl = (String) attributes.get("picture");
        String fullName = (String) attributes.get("name");

        if (email == null || email.isBlank()) {
            throw new OAuth2AuthenticationException(
                    "Google Account besitzt keine Email-Adresse");
        }

        // Fallback Vorname
        if (firstName == null || firstName.isBlank()) {

            if (fullName != null && !fullName.isBlank()) {
                firstName = fullName.split(" ")[0];
            } else {
                firstName = "Google";
            }
        }

        // Fallback Nachname
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

        userRepository.save(user);

        return new CustomOAuth2User(user, attributes);
    }
}