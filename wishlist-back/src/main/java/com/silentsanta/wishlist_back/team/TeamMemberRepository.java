package com.silentsanta.wishlist_back.team;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamMemberRepository extends JpaRepository<TeamMemberEntity, Long> {

    List<TeamMemberEntity> findByTeamId(Long teamId);

    List<TeamMemberEntity> findByUserId(Long userId);

    boolean existsByTeamIdAndUserId(Long teamId, Long userId);
}
