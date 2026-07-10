package ch.noseryoung.domain.recur.security;

import ch.noseryoung.domain.recur.models.User;

public interface RecurOAuth2User {

    User getUser();
}