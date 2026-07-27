package com.trinhminhvi.techshop.product.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.trinhminhvi.techshop.product.entity.ProductVariant;
import com.trinhminhvi.techshop.product.entity.VariantAttribute;
import com.trinhminhvi.techshop.product.entity.VariantAttributeId;

@Repository
public interface VariantAttributeRepository extends JpaRepository<VariantAttribute, VariantAttributeId> {
    @Modifying
    @Query("""
            DELETE FROM VariantAttribute va
            WHERE va.variant = :variant
            """)
    void deleteAllByVariant(@Param("variant") ProductVariant variant);
}