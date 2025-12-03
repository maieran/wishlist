package com.silentsanta.wishlist_back.admin.dto;


public record UpdateUserRequest(
        String username,
        String password,
        String displayName,
        Boolean admin
) {}
