package com.trinhminhvi.techshop.order.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.trinhminhvi.techshop.order.entity.Coupon;

@Repository
public interface CouponRepository extends JpaRepository<Coupon,Integer>{
    Optional<Coupon> findByCode(String code);
}
