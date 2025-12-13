package com.silentsanta.wishlist_back.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;   // Deine Freunde z.B. "andrej", "tim", "peter"

    @Column(nullable = false)
    private String passwordHash; // BCrypt

    @Column(nullable = false)
    private String displayName; // Anzeigename z.B. "André"

    @Column(nullable = false)
    private boolean admin; // Du & deine Frau = admin

    @Column(name = "active_team_id")
    private Long activeTeamId;

    @Column(name = "avatar_url", nullable = true)
    private String avatarUrl = "/static/avatars/default-avatar.png";

    public String getAvatarUrl() {
    return avatarUrl != null && !avatarUrl.isBlank()
            ? avatarUrl
            : "/avatars/default-avatar.png";
}


}

