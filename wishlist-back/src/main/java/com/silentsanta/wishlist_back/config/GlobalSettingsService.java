/*

package com.silentsanta.wishlist_back.config;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

@Service
public class GlobalSettingsService {

    public static final String MATCHING_TIMESTAMP_KEY = "matching.timestamp";

    private final GlobalSettingRepository repo;

    public GlobalSettingsService(GlobalSettingRepository repo) {
        this.repo = repo;
    }

    public Optional<Instant> getMatchingInstant() {
        return repo.findByKey(MATCHING_TIMESTAMP_KEY)
                   .map(gs -> Instant.parse(gs.getValue()));
    }

    public void setMatchingInstant(Instant instant) {
        GlobalSettingEntity setting = repo.findByKey(MATCHING_TIMESTAMP_KEY)
                .orElseGet(() -> {
                    GlobalSettingEntity s = new GlobalSettingEntity();
                    s.setKey(MATCHING_TIMESTAMP_KEY);
                    return s;
                });

        setting.setValue(instant.toString());
        repo.save(setting);
    }

    public void clearMatchingInstant() {
        repo.findByKey(MATCHING_TIMESTAMP_KEY)
            .ifPresent(repo::delete);
    }
}
*/