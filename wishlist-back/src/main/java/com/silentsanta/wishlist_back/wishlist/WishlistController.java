package com.silentsanta.wishlist_back.wishlist;

import com.silentsanta.wishlist_back.matching.MatchAssignmentRepository;
import com.silentsanta.wishlist_back.user.UserService;
import com.silentsanta.wishlist_back.wishlist.dto.WishlistItemRequest;
import com.silentsanta.wishlist_back.wishlist.dto.WishlistItemResponse;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;
    private final MatchAssignmentRepository matchAssignmentRepository;
    private final UserService userService;

    // ─────────────────────────────
    // EIGENE WISHLIST
    // ─────────────────────────────

    @GetMapping
    public ResponseEntity<List<WishlistItemResponse>> listMyItems() {
        return ResponseEntity.ok(wishlistService.listMyItems());
    }

    @PostMapping
    public ResponseEntity<WishlistItemResponse> createItem(@RequestBody WishlistItemRequest req) {
        WishlistItemResponse created = wishlistService.createItem(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<WishlistItemResponse> updateItem(
            @PathVariable Long id,
            @RequestBody WishlistItemRequest req
    ) {
        WishlistItemResponse updated = wishlistService.updateItem(id, req);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        wishlistService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }

    // ─────────────────────────────
    // PARTNER-WISHLIST
    // ─────────────────────────────
    @GetMapping("/of-user/{userId}")
    public ResponseEntity<List<WishlistItemResponse>> getWishlistOfUser(@PathVariable Long userId) {

        Long meId = userService.getAuthenticatedUser().getId();

        // ✅ Nur wenn ich GIVER → userId RECEIVER bin, darf ich die Wishlist sehen
        boolean isPartner = matchAssignmentRepository
                .existsByGiverIdAndReceiverId(meId, userId);

        if (!isPartner) {
            // kein Partner → 403
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<WishlistItemResponse> items = wishlistService.listItemsOfUser(userId);
        return ResponseEntity.ok(items);
    }
}
