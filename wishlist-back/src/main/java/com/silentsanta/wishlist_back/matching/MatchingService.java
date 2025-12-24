// src/main/java/com/silentsanta/wishlist_back/matching/MatchingService.java
package com.silentsanta.wishlist_back.matching;

import com.silentsanta.wishlist_back.team.TeamEntity;
import com.silentsanta.wishlist_back.team.TeamMemberEntity;
import com.silentsanta.wishlist_back.team.TeamMemberRepository;
import com.silentsanta.wishlist_back.team.TeamRepository;
import com.silentsanta.wishlist_back.user.UserEntity;
import com.silentsanta.wishlist_back.user.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MatchingService {

    private final TeamMemberRepository teamMemberRepository;
    private final TeamRepository teamRepository;
    private final MatchingRepository matchingRepository;
    private final MatchAssignmentRepository matchAssignmentRepository;
    private final MatchingAlgorithm matchingAlgorithm;
    private final MatchingConfigRepository matchingConfigRepository;
    private final UserService userService;

    // ──────────────────────────────────────────────
    // Partner eines Users in einem Team
    // ──────────────────────────────────────────────
    public Optional<UserEntity> findMyPartner(Long teamId, Long userId) {
        return matchAssignmentRepository
                .findByMatching_Team_IdAndGiver_Id(teamId, userId)
                .map(MatchAssignmentEntity::getReceiver);
    }

    // ──────────────────────────────────────────────
    // Assignments für Team löschen (bei Config delete)
    // ──────────────────────────────────────────────
    @Transactional
    public void clearAssignmentsForTeam(Long teamId) {
        List<MatchAssignmentEntity> oldAssignments =
                matchAssignmentRepository.findByMatching_Team_Id(teamId);
        if (!oldAssignments.isEmpty()) {
            matchAssignmentRepository.deleteAll(oldAssignments);
        }
    }

    // ──────────────────────────────────────────────
    // Matching für EIN Team erzeugen
    // ──────────────────────────────────────────────
    @Transactional
    public void createMatchingForTeam(Long teamId) {

        List<TeamMemberEntity> members = teamMemberRepository.findByTeamId(teamId);
        if (members.size() < 2) return;

        clearAssignmentsForTeam(teamId);

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

            UserEntity giver = userService.getById(giverId);
            UserEntity receiver = userService.getById(receiverId);

            assignment.setGiver(giver);
            assignment.setReceiver(receiver);

            matchAssignmentRepository.save(assignment);
        });
    }

    // ──────────────────────────────────────────────
    // Admin: Manual Override für Team
    // ──────────────────────────────────────────────
    @Transactional
    public void runManualForTeam(Long teamId) {
        MatchingConfig cfg = matchingConfigRepository.findByTeamId(teamId)
                .orElseGet(() -> {
                    MatchingConfig c = new MatchingConfig();
                    c.setTeamId(teamId);
                    return c;
                });

        createMatchingForTeam(teamId);

        cfg.setExecuted(true);
        cfg.setDirty(false);
        cfg.setLastRunAt(LocalDateTime.now());
        matchingConfigRepository.save(cfg);
    }

    // ──────────────────────────────────────────────
    // Admin: Rerun (nur wenn executed + dirty)
    // ──────────────────────────────────────────────
    @Transactional
    public void rerunForTeam(Long teamId) {
        MatchingConfig cfg = matchingConfigRepository.findByTeamId(teamId)
                .orElseThrow(() -> new RuntimeException("No config for team"));

        if (!cfg.isExecuted()) throw new RuntimeException("Not executed yet");
        if (!cfg.isDirty()) throw new RuntimeException("Not dirty");

        createMatchingForTeam(teamId);

        cfg.setExecuted(true);
        cfg.setDirty(false);
        cfg.setLastRunAt(LocalDateTime.now());
        matchingConfigRepository.save(cfg);
    }

    // ──────────────────────────────────────────────
    // Scheduler: checkt ALLE Teams, aber führt pro Team aus
    // ──────────────────────────────────────────────
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void checkAndRunMatching() {
        List<TeamEntity> teams = teamRepository.findAll();

        for (TeamEntity team : teams) {
            Long teamId = team.getId();

            MatchingConfig cfg = matchingConfigRepository.findByTeamId(teamId).orElse(null);
            if (cfg == null) continue;
            if (cfg.getMatchDate() == null) continue;
            if (cfg.isExecuted()) continue;

            // Nur ausführen wenn Zeit erreicht
            if (LocalDateTime.now().isBefore(cfg.getMatchDate())) continue;

            // Ausführen
            createMatchingForTeam(teamId);

            cfg.setExecuted(true);
            cfg.setDirty(false);
            cfg.setLastRunAt(LocalDateTime.now());
            matchingConfigRepository.save(cfg);
        }
    }

    public Map<String, Object> getMatchingStatusForTeam(Long teamId) {

        MatchingConfig cfg = matchingConfigRepository
                .findByTeamId(teamId)
                .orElse(null);

        Map<String, Object> result = new HashMap<>();

        if (cfg == null) {
            result.put("scheduledDate", null);
            result.put("executed", false);
            result.put("lastRunAt", null);
            return result;
        }

        result.put("scheduledDate", cfg.getMatchDate());
        result.put("executed", cfg.isExecuted());
        result.put("lastRunAt", cfg.getLastRunAt());

        return result;
    }

}
