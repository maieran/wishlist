package com.silentsanta.wishlist_back.admin;

import com.silentsanta.wishlist_back.user.UserEntity;
import com.silentsanta.wishlist_back.admin.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public List<UserEntity> getAllUsers() {
        return adminUserService.getAllUsers();
    }

    @PostMapping
    public UserEntity createUser(@RequestBody CreateUserRequest req) {
        return adminUserService.createUser(req);
    }

    @PutMapping("/{id}")
    public UserEntity updateUser(@PathVariable Long id,
                                 @RequestBody UpdateUserRequest req) {
        return adminUserService.updateUser(id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        adminUserService.deleteUser(id);

        return ResponseEntity.ok(
            Map.of("status", "deleted", "id", String.valueOf(id))
        );
    }

}
