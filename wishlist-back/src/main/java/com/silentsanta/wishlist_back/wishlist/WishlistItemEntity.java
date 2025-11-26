package com.silentsanta.wishlist_back.wishlist;

import com.silentsanta.wishlist_back.user.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "wishlist_items")
@Getter
@Setter
public class WishlistItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Besitzer des Items
    @ManyToOne(optional = false)
    private UserEntity owner;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    private Double price;

    private String imageUrl;   // z.B. später Cloud-URL, jetzt String

    @Column(nullable = false)
    private String priority;   // "red", "blue", "green", "none"
}
