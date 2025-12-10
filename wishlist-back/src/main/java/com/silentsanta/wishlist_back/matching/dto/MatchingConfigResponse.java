package com.silentsanta.wishlist_back.matching.dto;

import java.time.LocalDateTime;

public record MatchingConfigResponse(LocalDateTime dateTime,
                                         boolean executed,
                                         boolean dirty) {}
