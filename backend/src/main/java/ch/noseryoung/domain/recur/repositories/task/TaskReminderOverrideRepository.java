package ch.noseryoung.domain.recur.repositories.task;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ch.noseryoung.domain.recur.models.task.Task;
import ch.noseryoung.domain.recur.models.task.TaskReminderOverride;
import ch.noseryoung.domain.recur.models.User;

@Repository
public interface TaskReminderOverrideRepository extends JpaRepository<TaskReminderOverride, UUID> {
    Optional<TaskReminderOverride> findByTaskAndUser(Task task, User user);
}
