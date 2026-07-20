package com.trinhminhvi.techshop.cart.dto.response;

import java.math.BigDecimal;
import java.util.List;

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
public class CartItemResponse {

    private Integer cartItemId;

    private Integer variantId;

    private Integer productId;

    private String productName;

    private String thumbnail;

    private BigDecimal unitPrice;

    private Integer quantity;

    private BigDecimal subTotal;

    private List<VariantAttributeResponse> variantAttributes;
}