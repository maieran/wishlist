package com.silentsanta.wishlist_back.wishlist.dto;

public record WishlistItemResponse(
        Long id,
        String title,
        String description,
        Double price,
        String imageUrl,
        String priority
) {}
