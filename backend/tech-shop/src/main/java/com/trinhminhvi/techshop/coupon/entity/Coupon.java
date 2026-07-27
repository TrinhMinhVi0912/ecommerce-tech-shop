package com.trinhminhvi.techshop.coupon.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.trinhminhvi.techshop.coupon.enums.DiscountType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "coupons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "coupon_id")
    private Integer couponId;

    @Column(name = "name",nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private BigDecimal discount;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false)
    private DiscountType discountType;

    @Column(name = "minimum_order", nullable = false)
    private BigDecimal minimumOrder;

    @Column(name = "maximum_discount")
    private BigDecimal maximumDiscount;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "expire_date")
    private LocalDateTime expireDate;

    @Column(name = "active", nullable = false)
    private Boolean active;

    private String description;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "coupon")
    private List<CouponUsage> couponUsages;

}