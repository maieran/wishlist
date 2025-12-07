package com.silentsanta.wishlist_back.team.dto;

import java.util.List;

public record TeamMeResponse(
        Long teamId,
        String name,
        String inviteCode,
        boolean owner,
        List<TeamMemberDto> members,
        Long ownerId // highlight the owner of the Group
        
) {}
