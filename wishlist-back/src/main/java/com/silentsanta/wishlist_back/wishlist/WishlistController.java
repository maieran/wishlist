package com.silentsanta.wishlist_back.wishlist;

import com.silentsanta.wishlist_back.wishlist.dto.WishlistItemRequest;
import com.silentsanta.wishlist_back.wishlist.dto.WishlistItemResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    // GET /api/wishlist/me
    @GetMapping("/me")
    public ResponseEntity<List<WishlistItemResponse>> getMyWishlist() {
        return ResponseEntity.ok(wishlistService.getMyWishlist());
    }

    // POST /api/wishlist
    @PostMapping
    public ResponseEntity<WishlistItemResponse> createItem(
            @RequestBody WishlistItemRequest request
    ) {
        return ResponseEntity.ok(wishlistService.createItem(request));
    }

    // PUT /api/wishlist/{id}
    @PutMapping("/{id}")
    public ResponseEntity<WishlistItemResponse> updateItem(
            @PathVariable Long id,
            @RequestBody WishlistItemRequest request
    ) {
        return ResponseEntity.ok(wishlistService.updateItem(id, request));
    }

    // DELETE /api/wishlist/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        wishlistService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}
