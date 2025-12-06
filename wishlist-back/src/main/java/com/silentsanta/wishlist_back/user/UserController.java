package com.silentsanta.wishlist_back.user;

import com.silentsanta.wishlist_back.user.dto.UserLoginRequest;
import com.silentsanta.wishlist_back.user.dto.UserLoginResponse;
import lombok.RequiredArgsConstructor;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class UserController {


    private final UserService userService;

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

        return ResponseEntity.ok(
                new UserLoginResponse(
                        null, // kein Token hier
                        user.getId(),
                        user.getDisplayName(),
                        user.isAdmin()
                )
        );
    }




}
