package ch.noseryoung.domain.recur.dto;

public record AuthResponse(
        String token,
        UserResponse user) {
}