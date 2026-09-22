package ch.noseryoung.domain.recur.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ch.noseryoung.domain.recur.enums.NotificationType;
import ch.noseryoung.domain.recur.models.NotificationLog;
import ch.noseryoung.domain.recur.models.Task;
import ch.noseryoung.domain.recur.models.User;

@Repository
public interface NotificationLogRepository extends JpaRepository<NotificationLog, UUID> {
    boolean existsByTaskAndRecipientAndType(Task task, User recipient, NotificationType type);
}
