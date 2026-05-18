package com.trinhminhvi.techshop.dto.request;

import java.math.BigDecimal;

import com.trinhminhvi.techshop.entity.Brand;
import com.trinhminhvi.techshop.entity.Category;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GetAllProductRequest {
    private Integer pageNum = 1;
    private Integer pageSize = 5;
    private String sortBy = "productId";
    private String sortDir = "ASC";
    private String search;
    private BigDecimal minPrice = BigDecimal.ZERO;
    private BigDecimal maxPrice = BigDecimal.valueOf(Long.MAX_VALUE);
    private Integer brandId;
    private Integer categoryId;
}
