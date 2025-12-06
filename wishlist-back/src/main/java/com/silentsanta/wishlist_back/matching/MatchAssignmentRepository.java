package com.silentsanta.wishlist_back.matching;

import com.silentsanta.wishlist_back.matching.MatchAssignmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MatchAssignmentRepository extends JpaRepository<MatchAssignmentEntity, Long> {

    // Bereits von MatchingService genutzt:
    Optional<MatchAssignmentEntity> findByMatchingTeamIdAndGiverId(Long teamId, Long giverId);

    // NEU: Prüfen, ob aktueller User der Silent-Santa von userId ist
    boolean existsByGiverIdAndReceiverId(Long giverId, Long receiverId);

    Optional<MatchAssignmentEntity> findByGiverId(Long giverId);

}
