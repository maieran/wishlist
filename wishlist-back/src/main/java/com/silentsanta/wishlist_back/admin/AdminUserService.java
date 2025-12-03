package com.silentsanta.wishlist_back.admin;

import com.silentsanta.wishlist_back.user.UserEntity;
import com.silentsanta.wishlist_back.user.UserRepository;
import com.silentsanta.wishlist_back.admin.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    public UserEntity createUser(CreateUserRequest req) {
        UserEntity user = new UserEntity();

        user.setUsername(req.username());
        user.setDisplayName(req.displayName());
        user.setAdmin(req.admin());
        user.setPasswordHash(passwordEncoder.encode(req.password()));

        return userRepository.save(user);
    }

    public UserEntity updateUser(Long id, UpdateUserRequest req) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (req.username() != null) user.setUsername(req.username());
        if (req.displayName() != null) user.setDisplayName(req.displayName());
        if (req.admin() != null) user.setAdmin(req.admin());
        if (req.password() != null && !req.password().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(req.password()));
        }

        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
