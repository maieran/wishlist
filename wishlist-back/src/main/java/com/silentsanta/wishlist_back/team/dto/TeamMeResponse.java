package com.silentsanta.wishlist_back.team.dto;

import java.util.List;

public record TeamMeResponse(
        Long id,
        String name,
        String inviteCode,
        boolean isOwner,
        List<TeamMemberDto> members,
        Long ownerId,
        String teamAvatarUrl
) {}

