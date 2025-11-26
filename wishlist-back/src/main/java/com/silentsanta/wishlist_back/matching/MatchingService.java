package com.silentsanta.wishlist_back.matching;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.silentsanta.wishlist_back.team.TeamMemberRepository;
import com.silentsanta.wishlist_back.user.UserEntity;
import com.silentsanta.wishlist_back.team.TeamMemberEntity;

import jakarta.transaction.Transactional;

@Service
public class MatchingService {

  private final TeamMemberRepository teamMemberRepository;
  private final MatchingRepository matchingRepository;
  private final MatchAssignmentRepository matchAssignmentRepository;
  private final MatchingAlgorithm matchingAlgorithm;

  public MatchingService(
      TeamMemberRepository teamMemberRepository,
      MatchingRepository matchingRepository,
      MatchAssignmentRepository matchAssignmentRepository,
      MatchingAlgorithm matchingAlgorithm
  ) {
    this.teamMemberRepository = teamMemberRepository;
    this.matchingRepository = matchingRepository;
    this.matchAssignmentRepository = matchAssignmentRepository;
    this.matchingAlgorithm = matchingAlgorithm;
  }

  @Transactional
  public void createMatchingForTeam(Long teamId) {
    List<TeamMemberEntity> members = teamMemberRepository.findByTeamId(teamId);
    List<Long> userIds = members.stream()
                                .map(m -> m.getUser().getId())
                                .toList();

    Map<Long, Long> mapping = matchingAlgorithm.generateMatching(userIds);

    MatchingEntity matching = new MatchingEntity();
    matching.setTeam(members.get(0).getTeam());
    matching.setCreatedAt(Instant.now());
    matchingRepository.save(matching);

    for (Map.Entry<Long, Long> entry : mapping.entrySet()) {
      MatchAssignmentEntity assignment = new MatchAssignmentEntity();
      assignment.setMatching(matching);

      UserEntity giver = new UserEntity();
      giver.setId(entry.getKey());
      assignment.setGiver(giver);

      UserEntity receiver = new UserEntity();
      receiver.setId(entry.getValue());
      assignment.setReceiver(receiver);

      matchAssignmentRepository.save(assignment);
    }
  }

  public Optional<UserEntity> findMyPartner(Long teamId, Long userId) {
    return matchAssignmentRepository
      .findByMatchingTeamIdAndGiverId(teamId, userId)
      .map(MatchAssignmentEntity::getReceiver);
  }
}
