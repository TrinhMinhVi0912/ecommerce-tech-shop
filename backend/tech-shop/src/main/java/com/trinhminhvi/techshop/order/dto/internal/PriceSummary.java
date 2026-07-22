package com.trinhminhvi.techshop.order.dto.internal;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder    
@AllArgsConstructor
@NoArgsConstructor
public class PriceSummary {

    private BigDecimal totalPrice;

    private BigDecimal discountAmount;

    private BigDecimal finalPrice;

    private Integer totalQuantity;

    private Integer totalProduct;

}
