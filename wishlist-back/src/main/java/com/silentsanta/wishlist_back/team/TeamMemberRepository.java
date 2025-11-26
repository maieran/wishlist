package com.silentsanta.wishlist_back.team;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TeamMemberRepository extends JpaRepository<TeamMemberEntity, Long> {

    List<TeamMemberEntity> findByTeamId(Long teamId);

    boolean existsByTeamIdAndUserId(Long teamId, Long userId);
}
