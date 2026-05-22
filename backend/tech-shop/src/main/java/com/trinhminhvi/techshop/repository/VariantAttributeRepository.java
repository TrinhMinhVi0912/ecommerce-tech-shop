package com.trinhminhvi.techshop.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.trinhminhvi.techshop.entity.VariantAttribute;
import com.trinhminhvi.techshop.entity.VariantAttributeId;

@Repository
public interface VariantAttributeRepository extends JpaRepository<VariantAttribute,VariantAttributeId>{

}