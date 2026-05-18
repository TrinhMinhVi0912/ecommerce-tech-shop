package com.trinhminhvi.techshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.trinhminhvi.techshop.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category,Integer>{

}