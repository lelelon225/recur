package ch.noseryoung.domain.recur.repositories;

import java.util.*;
import org.springframework.stereotype.Repository;

import ch.noseryoung.domain.recur.models.Task;
import ch.noseryoung.domain.recur.models.User;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {
    public List<Task> findByIsArchived(Boolean isArchived);

    public List<Task> findByIsFavorite(Boolean isFavorite);

    public List<Task> findByOwner(User owner);

    public List<Task> findByOwnerAndIsArchived(User owner, Boolean isArchived);

    public List<Task> findByOwnerAndIsFavorite(User owner, Boolean isFavorite);

    public Optional<Task> findByIdAndOwner(UUID id, User owner);

    public void deleteByOwner(User owner);
}