package com.silentsanta.wishlist_back.team;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TeamMemberRepository extends JpaRepository<TeamMemberEntity, Long> {

    List<TeamMemberEntity> findByTeamId(Long teamId);

    List<TeamMemberEntity> findByUserId(Long userId);

    boolean existsByTeamIdAndUserId(Long teamId, Long userId);

    void deleteByTeamId(Long teamId);

    Optional<TeamMemberEntity> findOneByUserId(Long userId);
}
