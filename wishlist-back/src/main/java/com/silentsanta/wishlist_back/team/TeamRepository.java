package com.silentsanta.wishlist_back.team;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TeamRepository extends JpaRepository<TeamEntity, Long> {

    Optional<TeamEntity> findByInviteCode(String inviteCode);

    List<TeamEntity> findByOwnerId(Long ownerId);
}
