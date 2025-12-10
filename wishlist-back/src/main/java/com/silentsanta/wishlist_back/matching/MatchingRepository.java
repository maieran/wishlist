package com.silentsanta.wishlist_back.matching;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MatchingRepository extends JpaRepository<MatchingEntity, Long> {
    MatchingEntity findTopByOrderByCreatedAtDesc();
}
