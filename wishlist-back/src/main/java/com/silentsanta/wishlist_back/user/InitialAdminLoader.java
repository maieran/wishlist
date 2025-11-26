package com.silentsanta.wishlist_back.user;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

/** 
 * 
 * ONLY FOR TESTING
 * 
*/
@Component
public class InitialAdminLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public InitialAdminLoader(UserRepository userRepository,
                              PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // gemeinsames Standard-Passwort für alle Test-User
        String rawPassword = "test123";
        String encoded = passwordEncoder.encode(rawPassword);

        createUserIfNotExists("andre", "André", true, encoded);
        createUserIfNotExists("liza", "Liza", true, encoded);

        createUserIfNotExists("marina", "Marina", false, encoded);
        createUserIfNotExists("arina", "Arina", false, encoded);
        createUserIfNotExists("ivan",  "Ivan",  false, encoded);
        createUserIfNotExists("bogdan","Bogdan",false, encoded);
        createUserIfNotExists("ilona", "Ilona", false, encoded);
        createUserIfNotExists("daniel","Daniel",false, encoded);
        createUserIfNotExists("maxim", "Maxim", false, encoded);
        createUserIfNotExists("sascha","Sascha",false, encoded);
    }

    private void createUserIfNotExists(String username,
                                       String displayName,
                                       boolean admin,
                                       String encodedPassword) {

        userRepository.findByUsername(username)
                .ifPresentOrElse(
                        existing -> {
                            // Optional: hier könntest du spätere Anpassungen machen
                            // z.B. displayName/admin aktualisieren
                        },
                        () -> {
                            UserEntity u = new UserEntity();
                            u.setUsername(username);
                            u.setDisplayName(displayName);
                            u.setAdmin(admin);
                            u.setPasswordHash(encodedPassword);
                            userRepository.save(u);
                        }
                );
    }
}
