package ch.noseryoung.domain.recur.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ForgotPasswordRequest(
                @NotBlank(message = "E-Mail ist erforderlich") @Email(message = "E-Mail muss gültig sein") String email) {
}
