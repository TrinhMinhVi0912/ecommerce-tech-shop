package com.trinhminhvi.techshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.trinhminhvi.techshop.entity.Brand;

@Repository
public interface BrandRepository extends JpaRepository<Brand,Integer>{
    
}
