package com.trinhminhvi.techshop.coupon.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.trinhminhvi.techshop.coupon.entity.Coupon;
import com.trinhminhvi.techshop.coupon.entity.CouponUsage;
import com.trinhminhvi.techshop.user.entity.User;

@Repository
public interface CouponUsageRepository extends JpaRepository<CouponUsage, Integer> {
    boolean existsByUserAndCoupon(User user, Coupon coupon);

    void deleteByUserAndCoupon(User user, Coupon coupon);

    List<CouponUsage> findAllByCouponOrderByUsedAtDesc(Coupon coupon);

    @Query("""
            SELECT COUNT(cu)
            FROM CouponUsage cu
            WHERE cu.coupon.couponId = :couponId
            """)
    Long countUsage(@Param("couponId") Integer couponId);

    @Query("""
            SELECT cu
            FROM CouponUsage cu
            JOIN FETCH cu.user u
            WHERE

                cu.coupon.couponId = :couponId

            AND

            (
                :search IS NULL

                OR LOWER(u.userName)
                    LIKE LOWER(CONCAT('%', :search, '%'))

                OR LOWER(u.email)
                    LIKE LOWER(CONCAT('%', :search, '%'))
            )
            """)
    Page<CouponUsage> findCouponUsages(
            @Param("couponId") Integer couponId,
            @Param("search") String search,
            Pageable pageable);

}