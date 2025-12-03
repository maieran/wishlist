package com.silentsanta.wishlist_back.user;

import com.silentsanta.wishlist_back.user.dto.UserLoginRequest;
import com.silentsanta.wishlist_back.user.dto.UserLoginResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class UserController {


    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<UserLoginResponse> login(@RequestBody UserLoginRequest req) {

        UserEntity user = userService.getByUsername(req.getUsername());
        String token = userService.login(req.getUsername(), req.getPassword());

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
