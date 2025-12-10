package com.silentsanta.wishlist_back.matching;

import com.silentsanta.wishlist_back.user.UserEntity;
import com.silentsanta.wishlist_back.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Map;

@RestController
@RequestMapping("/api/matching")
@RequiredArgsConstructor
public class MatchingController {

    private final MatchingService matchingService;
    private final MatchingConfigRepository matchingConfigRepository;
    private final MatchingRepository matchingRepository;
    private final UserService userService;

    public record MatchingConfigResponse(LocalDateTime matchDate, boolean executed) {}
    public record MatchingConfigRequest(LocalDateTime matchDate) {}
    public record MatchingStatusDto(
            LocalDateTime matchDate,
            boolean executed,
            LocalDateTime lastRunAt,
            boolean hasPartner
    ) {}

    // GET Config
    @GetMapping("/config")
    public ResponseEntity<MatchingConfigResponse> getConfig() {
        MatchingConfig cfg = matchingConfigRepository.findById(1L).orElse(null);

        if (cfg == null) {
            return ResponseEntity.ok(new MatchingConfigResponse(null, false));
        }

        return ResponseEntity.ok(
                new MatchingConfigResponse(cfg.getMatchDate(), cfg.isExecuted())
        );
    }

    // ADMIN: Datum setzen
    @PostMapping("/config")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> setConfig(@RequestBody MatchingConfigRequest req) {
        MatchingConfig cfg = matchingConfigRepository.findById(1L)
                .orElseGet(() -> {
                    MatchingConfig c = new MatchingConfig();
                    c.setId(1L);
                    return c;
                });

        cfg.setMatchDate(req.matchDate());
        cfg.setExecuted(false); // Reset
        cfg.setDirty(true);
        matchingConfigRepository.save(cfg);

        return ResponseEntity.ok().build();
    }

    // ADMIN: Matching jetzt ausführen
    @PostMapping("/run-manual")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> runManual() {
        matchingService.runManually();
        return ResponseEntity.ok(Map.of("status", "ok"));
    }

    // ADMIN: Config leeren
    @PostMapping("/clear")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> clearConfig() {
        MatchingConfig cfg = matchingConfigRepository.findById(1L)
                .orElseGet(() -> {
                    MatchingConfig c = new MatchingConfig();
                    c.setId(1L);
                    return c;
                });

        cfg.setMatchDate(null);
        cfg.setExecuted(false);
        cfg.setDirty(true);
        matchingConfigRepository.save(cfg);

        return ResponseEntity.ok(Map.of("status", "cleared"));
    }

    // USER: Partner abrufen
    @GetMapping("/me")
    public ResponseEntity<?> myPartner(@RequestParam Long teamId) {
        UserEntity me = userService.getAuthenticatedUser();

        return matchingService.findMyPartner(teamId, me.getId())
                .map(u -> ResponseEntity.ok(
                        Map.of(
                                "found", true,
                                "userId", u.getId(),
                                "displayName", u.getDisplayName()
                        )
                ))
                .orElse(ResponseEntity.ok(
                        Map.of(
                                "found", false,
                                "message", "Kein Partner gefunden"
                        )
                ));
    }

    // 🔥 NEU: Matching-Status für Polling
    @GetMapping("/status")
    public ResponseEntity<MatchingStatusDto> status() {
        UserEntity me = userService.getAuthenticatedUser();

        MatchingConfig cfg = matchingConfigRepository.findById(1L).orElse(null);
        LocalDateTime matchDate = (cfg != null ? cfg.getMatchDate() : null);
        boolean executed = (cfg != null && cfg.isExecuted());

        MatchingEntity last = matchingRepository.findTopByOrderByCreatedAtDesc();
        LocalDateTime lastRunAt = null;
        if (last != null && last.getCreatedAt() != null) {
            lastRunAt = LocalDateTime.ofInstant(last.getCreatedAt(), ZoneOffset.UTC);
        }

        boolean hasPartner = false;
        if (me.getActiveTeamId() != null) {
            hasPartner = matchingService
                    .findMyPartner(me.getActiveTeamId(), me.getId())
                    .isPresent();
        }

        MatchingStatusDto dto = new MatchingStatusDto(
                matchDate,
                executed,
                lastRunAt,
                hasPartner
        );

        return ResponseEntity.ok(dto);
    }
}
