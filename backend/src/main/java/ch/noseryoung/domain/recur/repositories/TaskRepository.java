package ch.noseryoung.domain.recur.repositories;

import java.util.*;
import org.springframework.stereotype.Repository;

import ch.noseryoung.domain.recur.models.Task;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {
    public List<Task> findByIsArchived(Boolean isArchived);

    public List<Task> findByIsFavorite(Boolean isFavorite);

}