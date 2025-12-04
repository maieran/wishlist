package com.silentsanta.wishlist_back.matching;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.silentsanta.wishlist_back.team.TeamEntity;
import com.silentsanta.wishlist_back.team.TeamMemberEntity;
import com.silentsanta.wishlist_back.team.TeamMemberRepository;
import com.silentsanta.wishlist_back.team.TeamRepository;
import com.silentsanta.wishlist_back.user.UserEntity;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MatchingService {

    private final TeamMemberRepository teamMemberRepository;
    private final TeamRepository teamRepository;
    private final MatchingRepository matchingRepository;
    private final MatchAssignmentRepository matchAssignmentRepository;
    private final MatchingAlgorithm matchingAlgorithm;
    private final MatchingConfigRepository matchingConfigRepository;

    @Transactional
    public void createMatchingForTeam(Long teamId) {

        List<TeamMemberEntity> members = teamMemberRepository.findByTeamId(teamId);

        if (members.size() < 2) return;

        List<Long> userIds = members.stream()
            .map(m -> m.getUser().getId())
            .toList();

        Map<Long, Long> mapping = matchingAlgorithm.generateMatching(userIds);

        MatchingEntity matching = new MatchingEntity();
        matching.setTeam(members.get(0).getTeam());
        matching.setCreatedAt(Instant.now());
        matchingRepository.save(matching);

        mapping.forEach((giverId, receiverId) -> {
            MatchAssignmentEntity assignment = new MatchAssignmentEntity();
            assignment.setMatching(matching);

            UserEntity giver = new UserEntity();
            giver.setId(giverId);
            assignment.setGiver(giver);

            UserEntity receiver = new UserEntity();
            receiver.setId(receiverId);
            assignment.setReceiver(receiver);

            matchAssignmentRepository.save(assignment);
        });
    }

    public Optional<UserEntity> findMyPartner(Long teamId, Long userId) {
        return matchAssignmentRepository
            .findByMatchingTeamIdAndGiverId(teamId, userId)
            .map(MatchAssignmentEntity::getReceiver);
    }

    //────────── AUTOMATISCHER CRON JOB ──────────
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void checkAndRunMatching() {

        MatchingConfig cfg = matchingConfigRepository.findById(1L).orElse(null);
        if (cfg == null) return;
        if (cfg.getMatchDate() == null) return;
        if (cfg.isExecuted()) return;

        if (LocalDateTime.now().isAfter(cfg.getMatchDate())) {
            runSilentSantaMatching();
        }
    }

    //────────── MATCHING AUSFÜHREN ──────────
    @Transactional
    public void runSilentSantaMatching() {

        MatchingConfig cfg = matchingConfigRepository.findById(1L)
            .orElseGet(() -> { MatchingConfig c = new MatchingConfig(); c.setId(1L); return c; });

        if (cfg.isExecuted()) return;

        List<TeamEntity> teams = teamRepository.findAll();
        for (TeamEntity team : teams) {
            createMatchingForTeam(team.getId());
        }

        cfg.setExecuted(true);
        matchingConfigRepository.save(cfg);
    }

    //────────── MANUELLER START durch Admin ──────────
    @Transactional
    public void runManually() {

        MatchingConfig cfg = matchingConfigRepository.findById(1L)
            .orElseGet(() -> { MatchingConfig c = new MatchingConfig(); c.setId(1L); return c; });

        cfg.setExecuted(false); // erzwinge neues Matching
        matchingConfigRepository.save(cfg);

        runSilentSantaMatching();
    }
}

