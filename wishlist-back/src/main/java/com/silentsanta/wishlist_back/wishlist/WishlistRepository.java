package com.silentsanta.wishlist_back.wishlist;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WishlistRepository extends JpaRepository<WishlistItemEntity, Long> {

    // Alle Items des Owners (User)
    List<WishlistItemEntity> findByOwnerId(Long ownerId);
}
