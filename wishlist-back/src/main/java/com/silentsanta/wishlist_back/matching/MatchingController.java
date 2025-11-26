package com.silentsanta.wishlist_back.matching;

import com.silentsanta.wishlist_back.user.UserEntity;
import com.silentsanta.wishlist_back.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/matching")
@RequiredArgsConstructor
public class MatchingController {

    private final MatchingService matchingService;
    private final UserService userService;

    @PostMapping("/start/{teamId}")
    public ResponseEntity<?> startMatching(@PathVariable Long teamId) {
        matchingService.createMatchingForTeam(teamId);
        return ResponseEntity.ok("Matching started!");
    }

    @GetMapping("/me/{teamId}")
    public ResponseEntity<?> getMyPartner(@PathVariable Long teamId) {

        UserEntity me = userService.getAuthenticatedUser();

        return matchingService.findMyPartner(teamId, me.getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
