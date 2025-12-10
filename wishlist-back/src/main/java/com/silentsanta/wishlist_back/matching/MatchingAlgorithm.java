package com.silentsanta.wishlist_back.matching;

import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class MatchingAlgorithm {

    public Map<Long, Long> generateMatching(List<Long> userIds) {
        if (userIds.size() < 2) {
            throw new IllegalArgumentException("Need at least 2 users");
        }

        List<Long> givers = new ArrayList<>(userIds);
        List<Long> receivers = new ArrayList<>(userIds);

        for (int attempts = 0; attempts < 20; attempts++) {
            Collections.shuffle(receivers);
            boolean valid = true;
            for (int i = 0; i < givers.size(); i++) {
                if (givers.get(i).equals(receivers.get(i))) {
                    valid = false;
                    break;
                }
            }
            if (valid) break;
        }

        // Sicherstellen, dass keine Self-Matches übrig sind
        for (int i = 0; i < givers.size(); i++) {
            if (givers.get(i).equals(receivers.get(i))) {
                int j = (i + 1) % givers.size();
                Long tmp = receivers.get(i);
                receivers.set(i, receivers.get(j));
                receivers.set(j, tmp);
            }
        }

        Map<Long, Long> result = new HashMap<>();
        for (int i = 0; i < givers.size(); i++) {
            result.put(givers.get(i), receivers.get(i));
        }
        return result;
    }
}
