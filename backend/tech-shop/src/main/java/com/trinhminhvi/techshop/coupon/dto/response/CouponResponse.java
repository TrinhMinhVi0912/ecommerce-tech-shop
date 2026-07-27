package com.trinhminhvi.techshop.coupon.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.trinhminhvi.techshop.coupon.enums.DiscountType;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CouponResponse {

    private Integer couponId;

    private String name;

    private String code;

    private BigDecimal discount;

    private DiscountType discountType;

    private Integer quantity;

    private Long totalUsage;

    private Boolean active;

    private LocalDateTime startDate;

    private LocalDateTime expireDate;

}
