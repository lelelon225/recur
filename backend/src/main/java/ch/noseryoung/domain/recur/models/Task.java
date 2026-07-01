package ch.noseryoung.domain.recur.models;

import java.time.Instant;
import java.util.*;
import lombok.*;
import jakarta.persistence.*;

import ch.noseryoung.domain.recur.Enum.Category;
import ch.noseryoung.domain.recur.Enum.Frequency;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "task")
public class Task {

        @Id
        @GeneratedValue(strategy = GenerationType.UUID)
        @Column(name = "id")
        private UUID id;

        @Column(name = "name")
        private String name;

        @Enumerated(EnumType.STRING)
        @Column(name = "category")
        private Category category;

        @Enumerated(EnumType.STRING)
        @Column(name = "frequency")
        private Frequency frequency;

        @Column(name = "description")
        private String description;

        @Column(name = "date_until")
        private Instant dateUntil;

        @Column(name = "progress")
        private Double progress;

        @Column(name = "date_created")
        private Instant dateCreated;

        @Column(name = "days_in_span")
        private Integer daysInSpan;

        @Column(name = "amount_did")
        private Integer amountDid;

        @Column(name = "is_favorite")
        private Boolean isFavorite;

        @Column(name = "is_archived")
        private Boolean isArchived;
}