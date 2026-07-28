package com.trinhminhvi.techshop.brand.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.trinhminhvi.techshop.banner.entity.Banner;
import com.trinhminhvi.techshop.brand.entity.Brand;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Integer> {

    @Query("""
            SELECT b
            FROM Brand b
            WHERE (:search IS NULL OR LOWER(TRIM(b.name)) LIKE LOWER(CONCAT('%', TRIM(:search), '%')))
            """)
    Page<Brand> searchBrands(
            @Param("search") String search,
            Pageable pageable);

    @Query("SELECT COUNT(b) > 0 FROM Brand b WHERE LOWER(TRIM(b.name)) = LOWER(TRIM(:name))")
    boolean existsByNameIgnoreCaseTrim(@Param("name") String name);

    @Query("SELECT COUNT(b) > 0 FROM Brand b WHERE LOWER(TRIM(b.name)) = LOWER(TRIM(:name)) AND b.brandId != :brandId")
    boolean existsByNameIgnoreCaseTrimAndBrandIdNot(@Param("name") String name, @Param("brandId") Integer brandId);


}
