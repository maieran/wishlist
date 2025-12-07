package com.silentsanta.wishlist_back.team;

import com.silentsanta.wishlist_back.shared.ApiException;
import com.silentsanta.wishlist_back.team.dto.TeamMeResponse;
import com.silentsanta.wishlist_back.team.dto.TeamMemberDto;
import com.silentsanta.wishlist_back.user.UserEntity;
import com.silentsanta.wishlist_back.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/team")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;
    private final UserService userService;
    private final TeamMemberRepository teamMemberRepository;

    // ────────── Team erstellen ──────────
    @PostMapping("/create")
    public ResponseEntity<?> createTeam(@RequestBody Map<String, String> body) {
        String name = body.get("name");

        if (name == null || name.isBlank()) {
            throw new ApiException(400, "Name required");
        }

        TeamEntity team = teamService.createTeam(name);

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
            throw new ApiException(400, "Einladungscode wird benötigt");
        }

        TeamEntity team = teamService.joinTeam(inviteCode);

        return ResponseEntity.ok(Map.of(
                "teamId", team.getId(),
                "name", team.getName()
        ));
    }

    // ────────── Team verlassen (NEU) ──────────
    @PostMapping("/leave")
    public ResponseEntity<?> leave() {
        teamService.leaveTeam();
        return ResponseEntity.noContent().build();
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
        boolean isOwner = team.getOwner().getId().equals(me.getId());

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

    @PostMapping("/delete")
    public ResponseEntity<?> deleteTeam() {
        teamService.deleteTeam();
        return ResponseEntity.noContent().build(); // 204
    }

    @PostMapping("/kick/{userId}")
    public ResponseEntity<?> kickMember(@PathVariable Long userId) {
        teamService.kickMember(userId);
        return ResponseEntity.noContent().build(); // 204
    }


}
