package com.trinhminhvi.techshop.coupon.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.trinhminhvi.techshop.coupon.enums.DiscountType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CouponDetailResponse {

    private Integer couponId;

    private String name;

    private String code;

    private BigDecimal discount;

    private DiscountType discountType;

    private BigDecimal minimumOrder;

    private BigDecimal maximumDiscount;

    private Integer quantity;

    private LocalDateTime startDate;

    private LocalDateTime expireDate;

    private Boolean active;

    private String description;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
