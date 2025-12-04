package com.silentsanta.wishlist_back.config;

import com.silentsanta.wishlist_back.config.dto.MatchingDateRequest;
import com.silentsanta.wishlist_back.config.dto.MatchingDateResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/api/admin/settings")
@RequiredArgsConstructor
public class AdminSettingsController {

    private final GlobalSettingsService settingsService;

    @PostMapping("/matching-date")
    public ResponseEntity<MatchingDateResponse> setMatchingDate(@RequestBody MatchingDateRequest req) {
        Instant instant = req.dateTime();
        settingsService.setMatchingInstant(instant);
        return ResponseEntity.ok(new MatchingDateResponse(instant));
    }

    @DeleteMapping("/matching-date")
    public ResponseEntity<Void> clearMatchingDate() {
        settingsService.clearMatchingInstant();
        return ResponseEntity.noContent().build();
    }
}
