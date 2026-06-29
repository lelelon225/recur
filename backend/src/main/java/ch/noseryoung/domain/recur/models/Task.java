package ch.noseryoung.domain.recur.models;

import java.util.*;
import lombok.*;
import jakarta.persistence.*;

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

        @Column(name = "category")
        private String category;
        
        @Column(name = "progress")
        private Double progress;

        @Column(name = "goal")
        private String goal;

        @Column(name = "description")
        private String description;

        @Column(name = "date_until")
        private Date dateUntil;

        @Column(name = "date_created")
        private Date dateCreated;
}