package com.silentsanta.wishlist_back.user;

import com.silentsanta.wishlist_back.matching.MatchingService;
import com.silentsanta.wishlist_back.user.dto.UserLoginRequest;
import com.silentsanta.wishlist_back.user.dto.UserLoginResponse;
import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class UserController {


    private final UserService userService;
    private final MatchingService matchingService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginRequest req) {

        // 1️⃣ Prüfen, ob User existiert
        UserEntity user;
        try {
            user = userService.getByUsername(req.getUsername());
        } catch (Exception e) {
            return ResponseEntity
                    .status(404)
                    .body(Map.of("message", "Benutzer wurde nicht gefunden."));
        }

        // 2️⃣ Passwort prüfen
        String token;
        try {
            token = userService.login(req.getUsername(), req.getPassword());
        } catch (Exception e) {
            return ResponseEntity
                    .status(401)
                    .body(Map.of("message", "Passwort ist falsch."));
        }

        // 3️⃣ Erfolg → Token + Userdaten senden
        UserLoginResponse response = new UserLoginResponse(
                token,
                user.getId(),
                user.getDisplayName(),
                user.isAdmin()
        );

        return ResponseEntity.ok(response);
    }



    @GetMapping("/me")
    public ResponseEntity<?> me() {

        UserEntity user = userService.getAuthenticatedUser();
        Long activeTeamId = user.getActiveTeamId();

        Map<String, Object> matching = new HashMap<>();

        if (activeTeamId != null) {
            Map<String, Object> m = matchingService.getMatchingStatusForTeam(activeTeamId);

            matching.put("scheduledDate", m.get("scheduledDate"));
            matching.put("executed", m.get("executed"));
            matching.put("lastRunAt", m.get("lastRunAt"));

            // NEU → Partnerstatus
            boolean hasPartner = matchingService.findMyPartner(activeTeamId, user.getId()).isPresent();
            matching.put("hasPartner", hasPartner);

        } else {
            matching.put("scheduledDate", null);
            matching.put("executed", false);
            matching.put("lastRunAt", null);
            matching.put("hasPartner", false);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("displayName", user.getDisplayName());
        response.put("avatarUrl", user.getAvatarUrl());
        response.put("admin", user.isAdmin());
        response.put("activeTeamId", activeTeamId);
        response.put("matching", matching);

        return ResponseEntity.ok(response);
    }



    @PostMapping("/avatar")
    public ResponseEntity<?> uploadAvatar(@RequestParam("file") MultipartFile file) {
        String url = userService.uploadAvatar(file);
        return ResponseEntity.ok().body(Map.of("avatarUrl", url));
    }
}
