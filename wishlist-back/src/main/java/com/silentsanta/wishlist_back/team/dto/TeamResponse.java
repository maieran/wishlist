package com.silentsanta.wishlist_back.team.dto;

import java.util.List;

public class TeamResponse {

    public Long id;
    public String name;
    public String inviteCode;
    public List<MemberDto> members;

    public TeamResponse(Long id, String name, String inviteCode, List<MemberDto> members) {
        this.id = id;
        this.name = name;
        this.inviteCode = inviteCode;
        this.members = members;
    }

    public TeamResponse(boolean b, Object name2, Object inviteCode2, Object members2) {
        //TODO Auto-generated constructor stub
    }

    public static class MemberDto {
        public Long userId;
        public String username;
        public boolean isAdmin;

        public MemberDto(Long userId, String username, boolean isAdmin) {
            this.userId = userId;
            this.username = username;
            this.isAdmin = isAdmin;
        }
    }
}
