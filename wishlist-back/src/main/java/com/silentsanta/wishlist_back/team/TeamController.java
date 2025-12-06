package com.silentsanta.wishlist_back.team;

import com.silentsanta.wishlist_back.team.dto.TeamResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/team")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    // Nutzer sieht sein Team
    @GetMapping("/me")
    public ResponseEntity<?> myTeam() {
        TeamEntity t = teamService.myTeam();

        if (t == null) {
            return ResponseEntity.ok(
                    new TeamMeResponse(false, null, null, null)
            );
        }

        // vollständiges Team inklusive Mitglieder
        return ResponseEntity.ok(
                teamService.buildTeamResponse(t)
        );
    }

    // ADMIN: Team erstellen
    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createTeam(@RequestBody TeamCreateRequest req) {
        return ResponseEntity.ok(teamService.createTeam(req.name()));
    }

    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody TeamJoinRequest req) {
        return ResponseEntity.ok(teamService.joinTeam(req.inviteCode()));
    }

    @PostMapping("/leave")
    public ResponseEntity<?> leave() {
        teamService.leaveTeam();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/delete/{teamId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteTeam(@PathVariable Long teamId) {
        teamService.deleteTeam(teamId);
        return ResponseEntity.ok().build();
    }

    // OPTIONAL falls App später Details braucht
    @GetMapping("/me/details")
    public ResponseEntity<?> myTeamDetails() {
        TeamEntity t = teamService.myTeam();
        if (t == null) return ResponseEntity.ok(null);
        return ResponseEntity.ok(teamService.buildTeamResponse(t));
    }

    // ---- REQUEST RECORDS ----

    record TeamCreateRequest(String name) {}
    record TeamJoinRequest(String inviteCode) {}

    // ---- RESPONSE RECORD ----
    record TeamMeResponse(boolean hasTeam, Long teamId, String name, String inviteCode) {}
}
