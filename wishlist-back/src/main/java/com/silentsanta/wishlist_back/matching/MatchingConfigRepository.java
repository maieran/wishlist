package com.silentsanta.wishlist_back.matching;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface MatchingConfigRepository extends JpaRepository<MatchingConfig, Long> {

    @Modifying
    @Query("UPDATE MatchingConfig c SET c.dirty = true WHERE c.id = 1")
    void markDirty();
}
