package com.silentsanta.wishlist_back.user;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // Login wird vom UserController benutzt
    public String login(String username, String password) {
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new RuntimeException("Invalid password");
        }

        return jwtService.generateToken(user);
    }

    // User wird über sein Username gefunden
    public UserEntity getByUsername(String username) {
        return userRepository.findByUsername(username)
        .orElseThrow(() -> new RuntimeException("User not found"));
    }


    // Wird im JwtAuthFilter benutzt
    public UserEntity getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }


    // Wird von MatchingService, TeamService, WishlistService benutzt
    public UserEntity getAuthenticatedUser() {
        Object principal = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        if (principal instanceof CustomUserDetails cud) {
            return userRepository.findById(cud.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }

        throw new RuntimeException("No authenticated user");
    }

    public void setActiveTeam(Long teamId) {
        UserEntity me = getAuthenticatedUser();
        me.setActiveTeamId(teamId);
        userRepository.save(me);
    }

    public void save(UserEntity user) {
        if (user == null || user.getUsername().isEmpty()) {
            throw new RuntimeException("Invalid user");
        }
        userRepository.save(user);
    }

}
