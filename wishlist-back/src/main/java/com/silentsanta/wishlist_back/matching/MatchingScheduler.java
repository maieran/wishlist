package com.silentsanta.wishlist_back.matching;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class MatchingScheduler {

    private final MatchingConfigRepository configRepo;
    private final MatchingService matchingService;

    // Läuft jede 30 Sekunden
    @Scheduled(fixedRate = 30000)
    public void checkMatchingTime() {
        MatchingConfig cfg = configRepo.findById(1L).orElse(null);
        if (cfg == null) return;

        if (cfg.getMatchDate() == null) return;
        if (cfg.isExecuted()) return;

        LocalDateTime now = LocalDateTime.now();
        if (now.isAfter(cfg.getMatchDate())) {

            System.out.println("⏰ Silent Santa Matching wird jetzt ausgeführt!");
            matchingService.runSilentSantaMatching();

            cfg.setExecuted(true);
            configRepo.save(cfg);
        }
    }
}
