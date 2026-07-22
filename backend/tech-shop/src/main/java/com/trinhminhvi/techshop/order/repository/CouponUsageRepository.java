package com.trinhminhvi.techshop.order.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.trinhminhvi.techshop.order.entity.Coupon;
import com.trinhminhvi.techshop.order.entity.CouponUsage;
import com.trinhminhvi.techshop.user.entity.User;

@Repository
public interface CouponUsageRepository extends JpaRepository<CouponUsage, Integer> {
    boolean existsByUserAndCoupon(User user, Coupon coupon);
}