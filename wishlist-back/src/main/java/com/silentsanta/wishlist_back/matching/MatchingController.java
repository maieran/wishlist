// src/main/java/com/silentsanta/wishlist_back/matching/MatchingController.java
package com.silentsanta.wishlist_back.matching;

import com.silentsanta.wishlist_back.matching.dto.PartnerDto;
import com.silentsanta.wishlist_back.user.UserEntity;
import com.silentsanta.wishlist_back.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/matching")
@RequiredArgsConstructor
public class MatchingController {

    private final MatchingService matchingService;
    private final MatchingConfigRepository matchingConfigRepository;
    private final UserService userService;

    public record MatchingStatusDto(
            LocalDateTime matchDate,
            boolean executed,
            boolean dirty,
            LocalDateTime lastRunAt,
            boolean hasPartner
    ) {}

    // ✅ USER/UI: Status für EIN Team
    @GetMapping("/status")
    public ResponseEntity<?> status(@RequestParam Long teamId) {
        UserEntity me = userService.getAuthenticatedUser();

        MatchingConfig cfg = matchingConfigRepository.findByTeamId(teamId).orElse(null);

        boolean hasPartner = matchingService.findMyPartner(teamId, me.getId()).isPresent();

        return ResponseEntity.ok(new MatchingStatusDto(
                cfg != null ? cfg.getMatchDate() : null,
                cfg != null && cfg.isExecuted(),
                cfg != null && cfg.isDirty(),
                cfg != null ? cfg.getLastRunAt() : null,
                hasPartner
        ));
    }


    // ✅ USER: Partner (null-safe)
    @GetMapping("/me")
    public ResponseEntity<?> myPartner(@RequestParam Long teamId) {
        UserEntity me = userService.getAuthenticatedUser();

        return matchingService.findMyPartner(teamId, me.getId())
                .map(u -> ResponseEntity.ok(new PartnerDto(
                        true,
                        u.getId(),
                        u.getDisplayName(),
                        u.getAvatarUrl(),   // darf null sein -> DTO kann das
                        null
                )))
                .orElse(ResponseEntity.ok(new PartnerDto(
                        false,
                        null,
                        null,
                        null,
                        "Kein Partner gefunden"
                )));
    }


    // ✅ ADMIN: Datum setzen/ändern (pro Team)
    // Fix #2: Blockt Zeiten, die zu nah oder in der Vergangenheit sind
    @PostMapping("/config")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> setConfig(
            @RequestParam Long teamId,
            @RequestBody Map<String, String> body
    ) {
        String iso = body.get("matchDate");
        if (iso == null || iso.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "matchDate missing"));
        }

        LocalDateTime date = LocalDateTime.parse(iso); // ISO LocalDateTime expected: "2025-12-23T10:40:00"

        if (date.isBefore(LocalDateTime.now().plusMinutes(2))) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Match date must be at least 2 minutes in the future"
            ));
        }

        MatchingConfig cfg = matchingConfigRepository.findByTeamId(teamId)
                .orElseGet(() -> {
                    MatchingConfig c = new MatchingConfig();
                    c.setTeamId(teamId);
                    return c;
                });

        cfg.setMatchDate(date);
        cfg.setExecuted(false);
        cfg.setDirty(true);
        cfg.setLastRunAt(null);

        matchingConfigRepository.save(cfg);

        return ResponseEntity.ok(Map.of("status", "saved"));
    }

    // ✅ ADMIN: Löschen (pro Team)
    @DeleteMapping("/config")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> clear(@RequestParam Long teamId) {
        matchingConfigRepository.findByTeamId(teamId)
                .ifPresent(matchingConfigRepository::delete);

        // Optional: Zuordnungen löschen (sauber)
        matchingService.clearAssignmentsForTeam(teamId);

        return ResponseEntity.ok(Map.of("status", "deleted"));
    }

    // ✅ ADMIN: Manuell starten (Override)
    @PostMapping("/run-manual")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> runManual(@RequestParam Long teamId) {
        matchingService.runManualForTeam(teamId);
        return ResponseEntity.ok(Map.of("status", "ok"));
    }

    // ✅ ADMIN: Re-Run wenn dirty & executed
    @PostMapping("/rerun")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> rerun(@RequestParam Long teamId) {
        matchingService.rerunForTeam(teamId);
        return ResponseEntity.ok(Map.of("status", "rerun"));
    }
}
