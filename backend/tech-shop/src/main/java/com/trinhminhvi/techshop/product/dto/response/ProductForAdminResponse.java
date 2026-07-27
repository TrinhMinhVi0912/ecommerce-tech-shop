package com.trinhminhvi.techshop.product.dto.response;

import java.math.BigDecimal;

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
public class ProductForAdminResponse {
    private Integer productId;
    private String name;
    private BigDecimal basePrice;
    private Boolean isActive;
    @Builder.Default
    private String thumbnailImagePath = "/images/products/default.jpg";
}