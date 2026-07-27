package com.trinhminhvi.techshop.coupon.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.trinhminhvi.techshop.coupon.entity.Coupon;
import com.trinhminhvi.techshop.coupon.entity.CouponUsage;
import com.trinhminhvi.techshop.user.entity.User;

@Repository
public interface CouponUsageRepository extends JpaRepository<CouponUsage, Integer> {
    boolean existsByUserAndCoupon(User user, Coupon coupon);

    void deleteByUserAndCoupon(User user, Coupon coupon);

    List<CouponUsage> findAllByCouponOrderByUsedAtDesc(Coupon coupon);


}