package com.silentsanta.wishlist_back.team;

import com.silentsanta.wishlist_back.user.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "teams")
@Getter
@Setter
public class TeamEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    // Team-Owner (Admin)
    @ManyToOne(optional = false)
    private UserEntity owner;

    @Column(nullable = false, unique = true)
    private String inviteCode;

    @Column(name = "team_avatar_url")
    private String teamAvatarUrl = "/static/avatars/default-team.png";


    public String getTeamAvatarUrl() {
        return teamAvatarUrl != null && !teamAvatarUrl.isBlank()
                ? teamAvatarUrl
                : "/avatars/default-team.png";
    }

}
