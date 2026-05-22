package com.trinhminhvi.techshop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.trinhminhvi.techshop.entity.Product;
import com.trinhminhvi.techshop.entity.ProductImage;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage,Integer>{
    List<ProductImage> findAllByProduct(Product product);
}