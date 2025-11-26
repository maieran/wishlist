package com.silentsanta.wishlist_back.team;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/team")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    @PostMapping("/create")
    public ResponseEntity<?> createTeam(@RequestParam String name) {
        return ResponseEntity.ok(teamService.createTeam(name));
    }

    @PostMapping("/join")
    public ResponseEntity<?> joinTeam(@RequestParam String inviteCode) {
        return ResponseEntity.ok(teamService.joinTeam(inviteCode));
    }

    @GetMapping("/{teamId}/members")
    public ResponseEntity<?> listMembers(@PathVariable Long teamId) {
        return ResponseEntity.ok(teamService.listMembers(teamId));
    }
}
