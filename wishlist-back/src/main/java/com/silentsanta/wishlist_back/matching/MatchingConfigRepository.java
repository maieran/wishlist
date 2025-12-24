// src/main/java/com/silentsanta/wishlist_back/matching/MatchingConfigRepository.java
package com.silentsanta.wishlist_back.matching;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MatchingConfigRepository extends JpaRepository<MatchingConfig, Long> {

    @Modifying
    @Query("UPDATE MatchingConfig c SET c.dirty = true WHERE c.teamId = :teamId")
    void markDirtyByTeamId(@Param("teamId") Long teamId);

    Optional<MatchingConfig> findByTeamId(Long teamId);
}

