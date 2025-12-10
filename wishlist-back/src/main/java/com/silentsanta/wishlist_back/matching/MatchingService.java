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

    // ────────── Matching für EIN Team erzeugen ──────────
    @Transactional
    public void createMatchingForTeam(Long teamId) {

        List<TeamMemberEntity> members = teamMemberRepository.findByTeamId(teamId);

        // Zu wenige Leute → kein Matching
        if (members.size() < 2) return;

        // ALTE Zuordnungen für dieses Team löschen
        List<MatchAssignmentEntity> oldAssignments =
                matchAssignmentRepository.findByMatching_Team_Id(teamId);
        if (!oldAssignments.isEmpty()) {
            matchAssignmentRepository.deleteAll(oldAssignments);
        }

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

    // ────────── Partner eines Users in einem Team ──────────
    public Optional<UserEntity> findMyPartner(Long teamId, Long userId) {
        return matchAssignmentRepository
                .findByMatching_Team_IdAndGiver_Id(teamId, userId)
                .map(MatchAssignmentEntity::getReceiver);
    }

    // ────────── AUTOMATISCHER CRON JOB ──────────
    @Scheduled(fixedRate = 60000) // alle 60 Sekunden
    @Transactional
    public void checkAndRunMatching() {

        MatchingConfig cfg = matchingConfigRepository.findById(1L).orElse(null);
        if (cfg == null) return;
        if (cfg.getMatchDate() == null) return;

        // Noch nicht Zeit? → Abbruch
        if (LocalDateTime.now().isBefore(cfg.getMatchDate())) {
            return;
        }

        // Zeitpunkt erreicht → Matching ausführen
        runSilentSantaMatching();
    }

    // ────────── MATCHING AUSFÜHREN ──────────
    @Transactional
    public void runSilentSantaMatching() {

        MatchingConfig cfg = matchingConfigRepository.findById(1L)
                .orElseGet(() -> {
                    MatchingConfig c = new MatchingConfig();
                    c.setId(1L);
                    return c;
                });

        boolean anyExecuted = false;

        List<TeamEntity> teams = teamRepository.findAll();
        for (TeamEntity team : teams) {
            List<TeamMemberEntity> members = teamMemberRepository.findByTeamId(team.getId());
            if (members.size() >= 2) {
                createMatchingForTeam(team.getId());
                anyExecuted = true;
            }
        }

        if (anyExecuted) {
            cfg.setDirty(false);
            cfg.setExecuted(true);
            cfg.setLastRunAt(LocalDateTime.now());
            matchingConfigRepository.save(cfg);
        }
    }


    // ────────── MANUELLER START durch Admin ──────────
    @Transactional
    public void runManually() {

        MatchingConfig cfg = matchingConfigRepository.findById(1L)
                .orElseGet(() -> {
                    MatchingConfig config = new MatchingConfig();
                    config.setId(1L);
                    return config;
                });

        // Manuell erzwingt neues Matching
        cfg.setExecuted(false);
        cfg.setDirty(false);
        matchingConfigRepository.save(cfg);

        runSilentSantaMatching();
    }
}
