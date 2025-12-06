package com.silentsanta.wishlist_back.wishlist;

import com.silentsanta.wishlist_back.user.UserEntity;
import com.silentsanta.wishlist_back.user.UserService;
import com.silentsanta.wishlist_back.wishlist.dto.WishlistItemRequest;
import com.silentsanta.wishlist_back.wishlist.dto.WishlistItemResponse;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserService userService;

    // Mapping: Entity → Response DTO
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

    // Mapping: Request DTO + Owner → Entity
    private WishlistItemEntity fromRequest(WishlistItemRequest req, UserEntity owner) {
        WishlistItemEntity e = new WishlistItemEntity();
        e.setOwner(owner);
        e.setTitle(req.title());
        e.setDescription(req.description());
        e.setPrice(req.price());
        e.setImageUrl(req.imageUrl());
        e.setPriority(req.priority());
        return e;
    }

    @Transactional(readOnly = true)
    public List<WishlistItemResponse> listMyItems() {
        Long userId = userService.getAuthenticatedUser().getId();
        return wishlistRepository.findByOwnerId(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public WishlistItemResponse createItem(WishlistItemRequest req) {
        UserEntity me = userService.getAuthenticatedUser();
        WishlistItemEntity entity = fromRequest(req, me);
        WishlistItemEntity saved = wishlistRepository.save(entity);
        return toResponse(saved);
    }

    @Transactional
    public WishlistItemResponse updateItem(Long id, WishlistItemRequest req) {
        UserEntity me = userService.getAuthenticatedUser();

        WishlistItemEntity entity = wishlistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        // Sicherheit: Nur Owner darf eigenes Item ändern
        if (!entity.getOwner().getId().equals(me.getId())) {
            throw new RuntimeException("Forbidden");
        }

        entity.setTitle(req.title());
        entity.setDescription(req.description());
        entity.setPrice(req.price());
        entity.setImageUrl(req.imageUrl());
        entity.setPriority(req.priority());

        WishlistItemEntity saved = wishlistRepository.save(entity);
        return toResponse(saved);
    }

    @Transactional
    public void deleteItem(Long id) {
        UserEntity me = userService.getAuthenticatedUser();

        WishlistItemEntity entity = wishlistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (!entity.getOwner().getId().equals(me.getId())) {
            throw new RuntimeException("Forbidden");
        }

        wishlistRepository.delete(entity);
    }

    // 🔥 NEU: Wishlist eines anderen Users (z.B. Partner) lesen
    @Transactional(readOnly = true)
    public List<WishlistItemResponse> listItemsOfUser(Long userId) {
        return wishlistRepository.findByOwnerId(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }
}
