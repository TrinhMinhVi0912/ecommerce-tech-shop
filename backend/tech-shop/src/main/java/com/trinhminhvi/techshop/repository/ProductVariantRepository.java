package com.trinhminhvi.techshop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.trinhminhvi.techshop.entity.Product;
import com.trinhminhvi.techshop.entity.ProductVariant;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Integer> {
    @Query("""
                SELECT DISTINCT pv
                FROM ProductVariant pv
                LEFT JOIN FETCH pv.variantAttributes va
                LEFT JOIN FETCH va.attrValue av
                LEFT JOIN FETCH av.attribute
                WHERE pv.product = :product
            """)
    List<ProductVariant> findAllByProductWithAttributes(Product product);
}