package com.silentsanta.wishlist_back.matching;

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
    private final MatchingConfigRepository configRepo;
    private final UserService userService;

    public record MatchingConfigResponse(LocalDateTime matchDate, boolean executed) {}
    public record MatchingConfigRequest(LocalDateTime matchDate) {}
    public record PartnerResponse(Long userId, String displayName) {}

    @GetMapping("/config")
    public ResponseEntity<MatchingConfigResponse> getConfig() {
        MatchingConfig cfg = configRepo.findById(1L).orElse(null);
        if (cfg == null) return ResponseEntity.ok(new MatchingConfigResponse(null, false));

        return ResponseEntity.ok(new MatchingConfigResponse(cfg.getMatchDate(), cfg.isExecuted()));
    }

    @PostMapping("/config")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> setConfig(@RequestBody MatchingConfigRequest req) {
        MatchingConfig cfg = configRepo.findById(1L).orElse(new MatchingConfig());
        cfg.setId(1L);
        cfg.setMatchDate(req.matchDate());
        cfg.setExecuted(false);
        configRepo.save(cfg);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/run-manual")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> runManual() {
        matchingService.runManually();
        return ResponseEntity.ok(Map.of("status", "ok"));

    }

    @PostMapping("/clear")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> clearConfig() {
        MatchingConfig cfg = configRepo.findById(1L).orElse(new MatchingConfig());
        cfg.setId(1L);
        cfg.setMatchDate(null);
        cfg.setExecuted(false);
        configRepo.save(cfg);
        return ResponseEntity.ok("cleared");
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> myPartner(@RequestParam Long teamId) {
        UserEntity me = userService.getAuthenticatedUser();

        return matchingService.findMyPartner(teamId, me.getId())
                .map(u -> {
                    Map<String, Object> body = Map.of(
                            "found", true,
                            "userId", u.getId(),
                            "displayName", u.getDisplayName()
                    );
                    return ResponseEntity.ok(body);
                })
                .orElseGet(() -> {
                    Map<String, Object> body = Map.of(
                            "found", false,
                            "message", "Kein Partner gefunden"
                    );
                    return ResponseEntity.ok(body);
                });
    }

}


