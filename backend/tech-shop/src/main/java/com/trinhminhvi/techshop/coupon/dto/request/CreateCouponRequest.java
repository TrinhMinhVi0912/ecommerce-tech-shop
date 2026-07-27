package com.trinhminhvi.techshop.coupon.dto.request;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.trinhminhvi.techshop.coupon.enums.DiscountType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
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
public class CreateCouponRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String code;

    @NotNull
    @Positive
    private BigDecimal discount;

    @NotNull
    private DiscountType discountType;

    @NotNull
    @PositiveOrZero
    private BigDecimal minimumOrder;

    /**
     * Chỉ bắt buộc khi DiscountType = PERCENT.
     * FIXED có thể null.
     */
    private BigDecimal maximumDiscount;

    @NotNull
    @Positive
    private Integer quantity;

    @NotNull
    private LocalDateTime startDate;

    @NotNull
    private LocalDateTime expireDate;

    @Builder.Default
    private Boolean active = true;

    private String description;
}
