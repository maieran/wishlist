package com.silentsanta.wishlist_back.team;

import com.silentsanta.wishlist_back.user.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "team_members")
@Getter
@Setter
public class TeamMemberEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private TeamEntity team;

    @ManyToOne
    private UserEntity user;

    // NEU: Flag ob dieser User Admin des Teams ist
    private boolean admin;
}
