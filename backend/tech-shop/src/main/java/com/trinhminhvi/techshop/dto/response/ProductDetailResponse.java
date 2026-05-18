package com.trinhminhvi.techshop.dto.response;

import java.math.BigDecimal;
import java.util.Locale.Category;
import com.trinhminhvi.techshop.entity.Brand;
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

}
