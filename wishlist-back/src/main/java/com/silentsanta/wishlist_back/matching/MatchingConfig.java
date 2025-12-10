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

    // Wurde bereits ein Matching für dieses Datum ausgeführt?
    @Column(name = "executed", nullable = false)
    private boolean executed = false;

    // Wurden Teams geändert, nachdem Matching erzeugt wurde?
    // dirty = true  → Matching ist veraltet → muss neu erzeugt werden
    @Column(name = "dirty", nullable = false)
    private boolean dirty = false;

    @Column(name = "lastRunAt")
    private LocalDateTime lastRunAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getMatchDate() { return matchDate; }
    public void setMatchDate(LocalDateTime matchDate) { this.matchDate = matchDate; }

    public boolean isExecuted() { return executed; }
    public void setExecuted(boolean executed) { this.executed = executed; }

    public boolean isDirty() { return dirty; }
    public void setDirty(boolean dirty) { this.dirty = dirty; }

    public LocalDateTime getLastRunAt() { return lastRunAt; }
    public void setLastRunAt(LocalDateTime lastRunAt) { this.lastRunAt = lastRunAt; }
}
