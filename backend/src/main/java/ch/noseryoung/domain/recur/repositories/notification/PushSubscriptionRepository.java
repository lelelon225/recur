package ch.noseryoung.domain.recur.repositories.notification;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ch.noseryoung.domain.recur.models.PushSubscription;
import ch.noseryoung.domain.recur.models.User;

@Repository
public interface PushSubscriptionRepository extends JpaRepository<PushSubscription, UUID> {
    List<PushSubscription> findByUser(User user);

    Optional<PushSubscription> findByEndpoint(String endpoint);

    void deleteByEndpoint(String endpoint);
}
