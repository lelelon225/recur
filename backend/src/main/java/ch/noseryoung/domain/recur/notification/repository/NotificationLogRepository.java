package ch.noseryoung.domain.recur.notification.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ch.noseryoung.domain.recur.notification.enums.NotificationType;
import ch.noseryoung.domain.recur.notification.model.NotificationLog;
import ch.noseryoung.domain.recur.models.task.Task;
import ch.noseryoung.domain.recur.models.User;

@Repository
public interface NotificationLogRepository extends JpaRepository<NotificationLog, UUID> {
    boolean existsByTaskAndRecipientAndType(Task task, User recipient, NotificationType type);
}
