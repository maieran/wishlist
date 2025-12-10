package com.silentsanta.wishlist_back.team.dto;

public record TeamListItemDto(
        Long teamId,
        String name,
        boolean owner,
        Long ownerId,
        String inviteCode 
) {}
