package com.trinhminhvi.techshop.repository;

import java.math.BigDecimal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.trinhminhvi.techshop.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    @Query("""
            SELECT DISTINCT p
            FROM Product p
            LEFT JOIN p.productImages pi
            WHERE
                (:search IS NULL
                    OR LOWER(p.name)
                    LIKE LOWER(CONCAT('%', :search, '%')))

            AND
                (:brandId IS NULL
                    OR p.brand.brandId = :brandId)

            AND
                (:categoryId IS NULL
                    OR p.category.categoryId = :categoryId)

            AND
                (p.basePrice BETWEEN :minPrice AND :maxPrice)

            AND
                (pi IS NULL OR pi.isThumbnail = true)
            """)
    Page<Product> searchProduct(
            @Param("search") String search,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("brandId") Integer brandId,
            @Param("categoryId") Integer categoryId,
            Pageable pageable);


}
