package com.silentsanta.wishlist_back.wishlist.dto;

public record WishlistItemRequest(
        String title,
        String description,
        Double price,
        String imageUrl,
        String priority  // "red", "blue", "green", "none"
) {}
