package com.silentsanta.wishlist_back.matching;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/matching")
@RequiredArgsConstructor
public class MatchingConfigController {

    private final MatchingConfigRepository repo;
    private final MatchingService matchingService;

    @PostMapping("/date")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> setDate(@RequestBody Map<String,String> body) {
        LocalDateTime date = LocalDateTime.parse(body.get("matchDate"));

        MatchingConfig cfg = repo.findById(1L).orElse(new MatchingConfig());
        cfg.setMatchDate(date);
        repo.save(cfg);

        return ResponseEntity.ok(cfg);
    }

    @GetMapping("/date")
    public ResponseEntity<?> getDate() {
        return ResponseEntity.ok(
            repo.findById(1L).orElse(null)
        );
    }
}

