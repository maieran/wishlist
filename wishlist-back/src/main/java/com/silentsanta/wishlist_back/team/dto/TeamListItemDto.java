package com.silentsanta.wishlist_back.team.dto;

public record TeamListItemDto(
        Long teamId,
        String name,
        boolean isOwner,
        Long ownerId,
        String inviteCode,
        String teamAvatarUrl
) {}

