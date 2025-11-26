package com.silentsanta.wishlist_back.matching;

import com.silentsanta.wishlist_back.user.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "match_assignments")
public class MatchAssignmentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private MatchingEntity matching;

    @ManyToOne(optional = false)
    @JoinColumn(name = "giver_id")
    private UserEntity giver;

    @ManyToOne(optional = false)
    @JoinColumn(name = "receiver_id")
    private UserEntity receiver;

}
