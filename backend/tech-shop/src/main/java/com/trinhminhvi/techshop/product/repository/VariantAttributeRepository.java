package com.trinhminhvi.techshop.product.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.trinhminhvi.techshop.product.entity.VariantAttribute;
import com.trinhminhvi.techshop.product.entity.VariantAttributeId;

@Repository
public interface VariantAttributeRepository extends JpaRepository<VariantAttribute,VariantAttributeId>{

}