package com.silentsanta.wishlist_back.matching;

import java.time.Instant;

import com.silentsanta.wishlist_back.team.TeamEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

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

