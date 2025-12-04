package com.silentsanta.wishlist_back.config;

import com.silentsanta.wishlist_back.config.dto.MatchingDateResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SettingsController {

    private final GlobalSettingsService settingsService;

    @GetMapping("/matching-date")
    public ResponseEntity<MatchingDateResponse> getMatchingDate() {
        return settingsService.getMatchingInstant()
                .map(i -> ResponseEntity.ok(new MatchingDateResponse(i)))
                .orElseGet(() -> ResponseEntity.ok(new MatchingDateResponse((Instant) null)));
    }
}

