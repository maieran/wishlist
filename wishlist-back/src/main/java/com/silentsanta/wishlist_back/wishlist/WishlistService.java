package com.silentsanta.wishlist_back.wishlist;

import com.silentsanta.wishlist_back.user.UserEntity;
import com.silentsanta.wishlist_back.user.UserService;
import com.silentsanta.wishlist_back.wishlist.dto.WishlistItemRequest;
import com.silentsanta.wishlist_back.wishlist.dto.WishlistItemResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository repository;
    private final UserService userService;

    public List<WishlistItemResponse> getMyWishlist() {
        UserEntity me = userService.getAuthenticatedUser();

        return repository.findByOwnerId(me.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public WishlistItemResponse createItem(WishlistItemRequest request) {
        UserEntity me = userService.getAuthenticatedUser();

        WishlistItemEntity entity = new WishlistItemEntity();
        entity.setOwner(me);
        entity.setTitle(request.title());
        entity.setDescription(request.description());
        entity.setPrice(request.price());
        entity.setImageUrl(request.imageUrl());
        entity.setPriority(
                request.priority() != null ? request.priority() : "none"
        );

        repository.save(entity);

        return toResponse(entity);
    }

    public WishlistItemResponse updateItem(Long id, WishlistItemRequest request) {
        UserEntity me = userService.getAuthenticatedUser();

        WishlistItemEntity entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Wishlist item not found"));

        // Sicherheit: nur der Besitzer darf bearbeiten
        if (!entity.getOwner().getId().equals(me.getId())) {
            throw new RuntimeException("Not allowed to edit this item");
        }

        entity.setTitle(request.title());
        entity.setDescription(request.description());
        entity.setPrice(request.price());
        entity.setImageUrl(request.imageUrl());
        entity.setPriority(
                request.priority() != null ? request.priority() : "none"
        );

        repository.save(entity);

        return toResponse(entity);
    }

    public void deleteItem(Long id) {
        UserEntity me = userService.getAuthenticatedUser();

        WishlistItemEntity entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Wishlist item not found"));

        if (!entity.getOwner().getId().equals(me.getId())) {
            throw new RuntimeException("Not allowed to delete this item");
        }

        repository.delete(entity);
    }

    private WishlistItemResponse toResponse(WishlistItemEntity e) {
        return new WishlistItemResponse(
                e.getId(),
                e.getTitle(),
                e.getDescription(),
                e.getPrice(),
                e.getImageUrl(),
                e.getPriority()
        );
    }
}
