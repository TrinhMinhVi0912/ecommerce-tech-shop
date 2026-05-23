package com.trinhminhvi.techshop.dto.request;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GetProductsRequest{
    @Builder.Default
    private Integer pageNum = 1;

    @Builder.Default
    private Integer pageSize = 5;
    
    @Builder.Default
    private String sortBy = "productId";
    
    @Builder.Default
    private String sortDir = "ASC";
    
    private String search;
    
    @Builder.Default
    private BigDecimal minPrice = BigDecimal.ZERO;
    
    @Builder.Default
    private BigDecimal maxPrice = BigDecimal.valueOf(Long.MAX_VALUE);
    
    private Integer brandId;
    
    private Integer categoryId;
}
