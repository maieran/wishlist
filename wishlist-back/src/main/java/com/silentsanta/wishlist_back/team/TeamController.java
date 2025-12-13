package com.silentsanta.wishlist_back.team;

import com.silentsanta.wishlist_back.shared.ApiException;
import com.silentsanta.wishlist_back.team.dto.TeamListItemDto;
import com.silentsanta.wishlist_back.team.dto.TeamMeResponse;
import com.silentsanta.wishlist_back.team.dto.TeamMemberDto;
import com.silentsanta.wishlist_back.user.UserEntity;
import com.silentsanta.wishlist_back.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/team")
@RequiredArgsConstructor
public class TeamController {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final UserService userService;
    private final TeamService teamService;

    // ───────────────────────────────────────────────
    // 🟦 (1) Alle Teams des Users anzeigen
    // ───────────────────────────────────────────────
    @GetMapping("/list")
    public ResponseEntity<?> listMyTeams() {

        UserEntity me = userService.getAuthenticatedUser();

        List<TeamMemberEntity> memberships =
                teamMemberRepository.findByUserId(me.getId());

        List<TeamListItemDto> teams = memberships.stream()
                .map(m -> {
                    TeamEntity t = m.getTeam();

                    Long ownerId = (t.getOwner() != null)
                            ? t.getOwner().getId()
                            : null;

                    boolean isOwner = Objects.equals(ownerId, me.getId());

                    return new TeamListItemDto(
                            t.getId(),
                            t.getName(),
                            isOwner,
                            ownerId,
                            t.getInviteCode(),
                            t.getTeamAvatarUrl()
                    );

                })
                .toList();

        Map<String, Object> result = new HashMap<>();
        result.put("teams", teams);
        result.put("activeTeamId", me.getActiveTeamId());

        return ResponseEntity.ok(result);
    }

    // ───────────────────────────────────────────────
    // 🟦 (2) Detailinformationen eines Teams
    // ───────────────────────────────────────────────
    @GetMapping("/me")
    public ResponseEntity<?> myTeam(@RequestParam Long teamId) {

        if (teamId == null) {
            throw new ApiException(400, "teamId wird benötigt");
        }

        UserEntity me = userService.getAuthenticatedUser();

        boolean isMember = teamMemberRepository.existsByTeamIdAndUserId(teamId, me.getId());
        if (!isMember) {
            throw new ApiException(403, "Du gehörst nicht zu diesem Team.");
        }

        TeamEntity team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ApiException(404, "Team nicht gefunden."));



        List<TeamMemberDto> members = teamMemberRepository.findByTeamId(teamId)
                .stream()
                .map(tm -> new TeamMemberDto(
                        tm.getUser().getId(),
                        tm.getUser().getUsername(),
                        tm.getUser().getDisplayName()
                ))
                .toList();

                boolean isOwner = team.getOwner() != null &&
                team.getOwner().getId().equals(me.getId());
                
                TeamMeResponse res = new TeamMeResponse(
                        team.getId(),
                        team.getName(),
                        team.getInviteCode(),
                        isOwner,
                        members,
                        team.getOwner() != null ? team.getOwner().getId() : null,
                        team.getTeamAvatarUrl()
                );


        return ResponseEntity.ok(res);
    }

    // ───────────────────────────────────────────────
    // 🟦 (3) Team erstellen
    // ───────────────────────────────────────────────
    @PostMapping("/create")
    public ResponseEntity<?> createTeam(@RequestBody Map<String, String> body) {

        String name = body.get("name");

        if (name == null || name.isBlank()) {
            throw new ApiException(400, "Teamname darf nicht leer sein.");
        }

        TeamEntity team = teamService.createTeam(name);

        return ResponseEntity.ok(Map.of(
                "teamId", team.getId(),
                "inviteCode", team.getInviteCode()
        ));
    }

    // ───────────────────────────────────────────────
    // 🟦 (4) Team beitreten
    // ───────────────────────────────────────────────
    @PostMapping("/join")
    public ResponseEntity<?> joinTeam(@RequestBody Map<String, String> body) {

        String code = body.get("inviteCode");

        if (code == null || code.isBlank()) {
            throw new ApiException(400, "Einladungscode wird benötigt.");
        }

        TeamEntity team = teamService.joinTeam(code);

        return ResponseEntity.ok(Map.of(
                "teamId", team.getId(),
                "name", team.getName()
        ));
    }

    // ───────────────────────────────────────────────
    // 🟦 (5) Team aktivieren
    // ───────────────────────────────────────────────
    @PostMapping("/activate/{teamId}")
    public ResponseEntity<?> activate(@PathVariable Long teamId) {
        teamService.activateTeam(teamId);
        return ResponseEntity.ok(Map.of("status", "OK"));
    }

    // ───────────────────────────────────────────────
    // 🟦 (6) Team verlassen
    // ───────────────────────────────────────────────
    @PostMapping("/{teamId}/leave")
    public ResponseEntity<?> leaveTeam(@PathVariable Long teamId) {
        teamService.leaveTeam(teamId);
        return ResponseEntity.noContent().build();
    }

    // ───────────────────────────────────────────────
    // 🟦 (7) Team löschen (nur Owner)
    // ───────────────────────────────────────────────
    @PostMapping("/{teamId}/delete")
    public ResponseEntity<?> deleteTeam(@PathVariable Long teamId) {
        teamService.deleteTeam(teamId);
        return ResponseEntity.noContent().build();
    }

    // ───────────────────────────────────────────────
    // 🟦 (8) Mitglied kicken
    // ───────────────────────────────────────────────
    @PostMapping("/{teamId}/kick/{userId}")
    public ResponseEntity<?> kickMember(@PathVariable Long teamId, @PathVariable Long userId) {
        teamService.kickMember(teamId, userId);
        return ResponseEntity.noContent().build();
    }

}
