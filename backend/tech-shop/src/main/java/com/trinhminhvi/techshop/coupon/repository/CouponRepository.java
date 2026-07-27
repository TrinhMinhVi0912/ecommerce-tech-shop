package com.trinhminhvi.techshop.coupon.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.trinhminhvi.techshop.coupon.entity.Coupon;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Integer> {

    Optional<Coupon> findByCode(String code);

    boolean existsByCode(String code);

    boolean existsByCodeAndCouponIdNot(String code, Integer couponId);

    @Query("""
            SELECT c
            FROM Coupon c
            WHERE

                (
                    :search IS NULL
                    OR LOWER(c.name)
                        LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(c.code)
                        LIKE LOWER(CONCAT('%', :search, '%'))
                )

            AND

                (
                    :active IS NULL
                    OR c.active = :active
                )
            """)
    Page<Coupon> searchCoupons(
            String search,
            Boolean active,
            Pageable pageable);

}
