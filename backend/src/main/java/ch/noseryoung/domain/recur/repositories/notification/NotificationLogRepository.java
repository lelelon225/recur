package ch.noseryoung.domain.recur.repositories.notification;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ch.noseryoung.domain.recur.enums.notification.NotificationType;
import ch.noseryoung.domain.recur.models.notification.NotificationLog;
import ch.noseryoung.domain.recur.task.model.Task;
import ch.noseryoung.domain.recur.models.User;

@Repository
public interface NotificationLogRepository extends JpaRepository<NotificationLog, UUID> {
    boolean existsByTaskAndRecipientAndType(Task task, User recipient, NotificationType type);
}
