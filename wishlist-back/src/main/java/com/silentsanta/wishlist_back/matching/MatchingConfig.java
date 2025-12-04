package com.silentsanta.wishlist_back.matching;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "matching_config")
public class MatchingConfig {

    @Id
    private Long id = 1L;

    @Column(name = "match_date")
    private LocalDateTime matchDate;

    @Column(name = "executed", nullable = false)
    private boolean executed = false;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getMatchDate() { return matchDate; }
    public void setMatchDate(LocalDateTime matchDate) { this.matchDate = matchDate; }

    public boolean isExecuted() { return executed; }
    public void setExecuted(boolean executed) { this.executed = executed; }
}
