package com.silentsanta.wishlist_back.matching;

import com.silentsanta.wishlist_back.team.TeamEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "matching")
@Setter
@Getter
public class MatchingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private TeamEntity team;

    private Instant createdAt;
}
