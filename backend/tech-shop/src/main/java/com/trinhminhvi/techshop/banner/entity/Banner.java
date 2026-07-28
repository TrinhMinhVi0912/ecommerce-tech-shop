package com.trinhminhvi.techshop.banner.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "banners")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Banner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "banner_id")
    private Integer bannerId;

    @Column(name = "title",nullable = false)
    private String title;

    @Column(name = "image_path",nullable = false)
    private String imagePath;

    @Builder.Default
    @Column(name = "is_active",nullable = false)
    private Boolean isActive = true;

    @Column(name = "update_at",nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "created_at",nullable = false)
    private LocalDateTime createdAt;

}
