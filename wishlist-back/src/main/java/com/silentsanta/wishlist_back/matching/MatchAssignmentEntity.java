package com.silentsanta.wishlist_back.matching;

import com.silentsanta.wishlist_back.user.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "match_assignment")
@Getter
@Setter
public class MatchAssignmentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private MatchingEntity matching;

    @ManyToOne
    @JoinColumn(name = "giver_id")
    private UserEntity giver;

    @ManyToOne
    @JoinColumn(name = "receiver_id")
    private UserEntity receiver;

}
