package com.silentsanta.wishlist_back.admin.dto;

public record CreateUserRequest(
        String username,
        String password,
        String displayName,
        boolean admin
) {}

