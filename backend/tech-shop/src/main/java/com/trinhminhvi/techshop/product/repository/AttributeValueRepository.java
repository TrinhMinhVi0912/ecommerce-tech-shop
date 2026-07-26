package com.trinhminhvi.techshop.product.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.trinhminhvi.techshop.product.entity.Attribute;
import com.trinhminhvi.techshop.product.entity.AttributeValue;

@Repository
public interface AttributeValueRepository extends JpaRepository<AttributeValue, Integer> {
    Optional<AttributeValue> findByAttributeAndValueIgnoreCase(Attribute attribute, String value);
}
