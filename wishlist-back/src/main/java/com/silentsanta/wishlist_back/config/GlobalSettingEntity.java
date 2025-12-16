
/* 
package com.silentsanta.wishlist_back.config;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "global_settings")
@Getter
@Setter
public class GlobalSettingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String key;

    @Column(nullable = false)
    private String value; // wir speichern ISO-String (Instant.toString)
}
*/
