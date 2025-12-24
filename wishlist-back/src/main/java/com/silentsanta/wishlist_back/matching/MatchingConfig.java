// src/main/java/com/silentsanta/wishlist_back/matching/MatchingConfig.java
package com.silentsanta.wishlist_back.matching;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "matching_config",
    uniqueConstraints = @UniqueConstraint(columnNames = {"team_id"})
)
@Getter
@Setter
public class MatchingConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "team_id", nullable = false)
    private Long teamId;

    @Column(name = "match_date")
    private LocalDateTime matchDate;

    @Column(name = "executed", nullable = false)
    private boolean executed = false;

    @Column(name = "dirty", nullable = false)
    private boolean dirty = false;

    @Column(name = "last_run_at")
    private LocalDateTime lastRunAt;
}
