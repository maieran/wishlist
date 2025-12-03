package com.silentsanta.wishlist_back.admin.dto;

public record AdminUserDTO(
    String username,
    String displayName,
    boolean admin,
    String password
) {}

