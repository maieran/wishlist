package com.silentsanta.wishlist_back.matching.dto;

public record PartnerDto(
        boolean found,
        Long userId,
        String displayName,
        String avatarUrl,
        String message
) {}

