package com.silentsanta.wishlist_back.matching;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MatchAssignmentRepository extends JpaRepository<MatchAssignmentEntity, Long> {

    Optional<MatchAssignmentEntity> findByMatchingTeamIdAndGiverId(Long teamId, Long giverId);
}
