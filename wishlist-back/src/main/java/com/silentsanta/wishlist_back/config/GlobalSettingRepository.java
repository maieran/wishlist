package com.silentsanta.wishlist_back.config;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GlobalSettingRepository extends JpaRepository<GlobalSettingEntity, Long> {
    Optional<GlobalSettingEntity> findByKey(String key);
}
