package com.silentsanta.wishlist_back.matching;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MatchAssignmentRepository extends JpaRepository<MatchAssignmentEntity, Long> {

    // Für MyPartner: aktueller Partner eines Users in einem Team
    Optional<MatchAssignmentEntity> findByMatching_Team_IdAndGiver_Id(Long teamId, Long giverId);

    // Für Neu-Matching: alle alten Zuordnungen eines Teams löschen
    List<MatchAssignmentEntity> findByMatching_Team_Id(Long teamId);
}
