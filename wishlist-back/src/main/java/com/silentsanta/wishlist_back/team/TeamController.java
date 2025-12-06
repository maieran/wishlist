package com.silentsanta.wishlist_back.team;

import com.silentsanta.wishlist_back.user.UserEntity;
import com.silentsanta.wishlist_back.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/team")
@RequiredArgsConstructor
public class TeamController {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final UserService userService;

    // DTO fürs Frontend
    public record TeamMemberDto(Long userId, String username, String displayName) {}
    public record TeamMeResponse(
            Long teamId,
            String name,
            String inviteCode,
            boolean owner,
            List<TeamMemberDto> members
    ) {}

    // ────────── Team erstellen ──────────
    @PostMapping("/create")
    public ResponseEntity<?> createTeam(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        if (name == null || name.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Name required"));
        }

        UserEntity me = userService.getAuthenticatedUser();

        TeamEntity team = new TeamEntity();
        team.setName(name);
        team.setInviteCode(UUID.randomUUID().toString().substring(0, 4).toUpperCase());
        team.setOwner(me);
        teamRepository.save(team);

        TeamMemberEntity member = new TeamMemberEntity();
        member.setTeam(team);
        member.setUser(me);
        teamMemberRepository.save(member);

        return ResponseEntity.ok(Map.of(
                "teamId", team.getId(),
                "inviteCode", team.getInviteCode()
        ));
    }

    // ────────── Team beitreten ──────────
    @PostMapping("/join")
    public ResponseEntity<?> joinTeam(@RequestBody Map<String, String> body) {
        String inviteCode = body.get("inviteCode");
        if (inviteCode == null || inviteCode.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Einladungscode wird benötigt"));
        }

        Optional<TeamEntity> optionalTeam = teamRepository.findByInviteCode(inviteCode);
        if (!optionalTeam.isPresent()) {
            return ResponseEntity.status(404).body("Ungültiger Einladungscode");
        }

        TeamEntity team = optionalTeam.get();

        UserEntity me = userService.getAuthenticatedUser();

        boolean alreadyMember = teamMemberRepository.existsByTeamIdAndUserId(team.getId(), me.getId());
        if (!alreadyMember) {
            TeamMemberEntity member = new TeamMemberEntity();
            member.setTeam(team);
            member.setUser(me);
            teamMemberRepository.save(member);
        }

        return ResponseEntity.ok(Map.of(
                "teamId", team.getId(),
                "name", team.getName()
        ));
    }

    // ────────── /api/team/me → aktuelles Team ──────────
    @GetMapping("/me")
    public ResponseEntity<?> myTeam() {
        UserEntity me = userService.getAuthenticatedUser();

        List<TeamMemberEntity> memberships = teamMemberRepository.findByUserId(me.getId());

        if (memberships.isEmpty()) {
            return ResponseEntity.ok(Map.of("hasTeam", false));
        }

        TeamEntity team = memberships.get(0).getTeam();
        boolean isOwner = team.getOwner() != null && team.getOwner().getId().equals(me.getId());

        List<TeamMemberDto> members = teamMemberRepository.findByTeamId(team.getId())
                .stream()
                .map(tm -> new TeamMemberDto(
                        tm.getUser().getId(),
                        tm.getUser().getUsername(),
                        tm.getUser().getDisplayName()
                ))
                .toList();

        return ResponseEntity.ok(new TeamMeResponse(
                team.getId(),
                team.getName(),
                team.getInviteCode(),
                isOwner,
                members
        ));
    }
}
