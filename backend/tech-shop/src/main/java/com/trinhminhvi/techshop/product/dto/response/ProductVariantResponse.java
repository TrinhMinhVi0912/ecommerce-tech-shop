package com.trinhminhvi.techshop.product.dto.response;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantResponse {
    private Integer variantId;
    private BigDecimal price;
    private Integer stock;
    private String sku;
    private List<AttriubutesValueResponse> attributes;
}
