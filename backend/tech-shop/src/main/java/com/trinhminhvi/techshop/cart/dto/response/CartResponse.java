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
public class CartResponse {

    private Integer cartId;

    private Integer totalItems;

    private BigDecimal totalAmount;

    private List<CartItemResponse> items;
}
