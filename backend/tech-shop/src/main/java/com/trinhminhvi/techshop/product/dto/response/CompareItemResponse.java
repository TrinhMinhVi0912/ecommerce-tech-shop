package com.trinhminhvi.techshop.product.dto.response;

import java.math.BigDecimal;
import java.util.List;

import com.trinhminhvi.techshop.brand.dto.response.BrandResponse;
import com.trinhminhvi.techshop.category.dto.response.CategoryResponse;

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
public class CompareItemResponse {

    private Integer productId;

    private String name;

    private String description;

    private BigDecimal basePrice;

    private BrandResponse brandResponse;

    private CategoryResponse categoryResponse;

    private String thumbnailImagePath;

    private List<ProductVariantResponse> variants;

}
