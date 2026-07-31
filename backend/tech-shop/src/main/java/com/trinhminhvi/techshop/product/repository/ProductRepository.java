package com.trinhminhvi.techshop.product.repository;

import java.math.BigDecimal;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.trinhminhvi.techshop.product.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
@Query("""
            SELECT DISTINCT p
            FROM Product p
            LEFT JOIN p.productImages pi
            WHERE
                (:isActive IS NULL OR p.isActive = :isActive)
                AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')))
                AND (:brandId IS NULL OR p.brand.brandId = :brandId)
                AND (
                    :categoryIds IS NULL 
                    OR p.category.categoryId IN :categoryIds
                )
                AND (:minPrice IS NULL OR p.basePrice >= :minPrice)
                AND (:maxPrice IS NULL OR p.basePrice <= :maxPrice)
                AND (pi IS NULL OR pi.isThumbnail = true)
            ORDER BY p.productId DESC
            """)
    Page<Product> searchProduct(
            @Param("search") String search,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("brandId") Integer brandId,
            @Param("categoryIds") Set<Integer> categoryIds,  // Đổi từ categoryId sang Set
            @Param("isActive") Boolean isActive,
            Pageable pageable);

    boolean existsByCategoryCategoryId(Integer categoryId);

    boolean existsByBrandBrandId(Integer brandId);

    @Query("SELECT COUNT(p) > 0 FROM Product p WHERE LOWER(TRIM(p.name)) = LOWER(TRIM(:name))")
    boolean existsByNameIgnoreCaseTrim(@Param("name") String name);

    @Query("""
            SELECT COUNT(p) > 0
            FROM Product p
            WHERE LOWER(TRIM(p.name)) = LOWER(TRIM(:name))
            AND p.productId <> :productId
            """)
    boolean existsByNameIgnoreCaseAndProductIdNot(
            String name,
            Integer productId);

    long countByIsActiveTrue();
}
