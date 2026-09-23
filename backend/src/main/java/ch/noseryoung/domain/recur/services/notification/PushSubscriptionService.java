package ch.noseryoung.domain.recur.services.notification;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ch.noseryoung.domain.recur.dto.notification.PushSubscriptionRequest;
import ch.noseryoung.domain.recur.models.PushSubscription;
import ch.noseryoung.domain.recur.models.User;
import ch.noseryoung.domain.recur.repositories.PushSubscriptionRepository;
import ch.noseryoung.domain.recur.security.CustomUserDetails;

@Service
public class PushSubscriptionService {

    private final PushSubscriptionRepository pushSubscriptionRepository;
    private final String vapidPublicKey;

    public PushSubscriptionService(PushSubscriptionRepository pushSubscriptionRepository,
            @Value("${app.push.vapid-public-key}") String vapidPublicKey) {
        this.pushSubscriptionRepository = pushSubscriptionRepository;
        this.vapidPublicKey = vapidPublicKey;
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
            throw new IllegalStateException("Kein authentifizierter User im SecurityContext gefunden");
        }

        return userDetails.getUser();
    }

    public String getVapidPublicKey() {
        return vapidPublicKey;
    }

    // Idempotent: derselbe Browser kann sich mehrfach re-subscriben (z.B. nach
    // erneutem Aktivieren des Toggles), der endpoint ist dabei stabil.
    public void subscribe(PushSubscriptionRequest request) {
        User user = getCurrentUser();

        PushSubscription subscription = pushSubscriptionRepository.findByEndpoint(request.endpoint())
                .orElseGet(() -> PushSubscription.builder().endpoint(request.endpoint()).build());

        subscription.setUser(user);
        subscription.setP256dhKey(request.keys().p256dh());
        subscription.setAuthKey(request.keys().auth());

        pushSubscriptionRepository.save(subscription);
    }

    // deleteByEndpoint is a derived delete query (load+remove under the
    // hood) - needs an active transaction, or Hibernate throws
    // TransactionRequiredException.
    @Transactional
    public void unsubscribe(String endpoint) {
        pushSubscriptionRepository.deleteByEndpoint(endpoint);
    }
}
