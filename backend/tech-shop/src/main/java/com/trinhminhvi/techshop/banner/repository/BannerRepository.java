package com.trinhminhvi.techshop.banner.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.trinhminhvi.techshop.banner.entity.Banner;

@Repository
public interface BannerRepository extends JpaRepository<Banner, Integer> {

    boolean existsByTitleIgnoreCase(String title);

    @Query("""
            SELECT COUNT(b) > 0
            FROM Banner b
            WHERE LOWER(TRIM(b.title)) = LOWER(TRIM(:title))
            """)
    boolean existsTitle(
            @Param("title") String title);

    @Query("""
            SELECT b
            FROM Banner b
            WHERE

            (
                :search IS NULL

                OR LOWER(b.title)
                    LIKE LOWER(CONCAT('%', :search, '%'))
            )
            """)
    Page<Banner> searchBanner(
            @Param("search") String search,
            Pageable pageable);

    List<Banner> findByIsActiveTrueOrderByCreatedAtDesc();

}