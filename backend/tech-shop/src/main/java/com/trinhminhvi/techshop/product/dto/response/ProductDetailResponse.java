package com.trinhminhvi.techshop.product.dto.response;

import java.math.BigDecimal;
import java.util.List;
import java.util.Locale.Category;

import com.trinhminhvi.techshop.brand.dto.response.BrandResponse;
import com.trinhminhvi.techshop.brand.entity.Brand;
import com.trinhminhvi.techshop.category.dto.response.CategoryResponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailResponse {
    private Integer productId;
    private String name;
    private String description;
    private BigDecimal basePrice;
    private BrandResponse brandResponse;
    private CategoryResponse categoryResponse;
    private List<ProductImageResponse> images;
    private List<ProductVariantResponse> variants;
}
