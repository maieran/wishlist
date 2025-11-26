package com.silentsanta.wishlist_back.user.dto;

public record UserLoginResponse(
    String token,
    Long userId,
    String displayName,
    boolean admin
) {}

