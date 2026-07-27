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
public class ProductDetailForAdminResponse {
    private ProductDetailResponse productDetailResponse;
    private Boolean isActive; 
}
