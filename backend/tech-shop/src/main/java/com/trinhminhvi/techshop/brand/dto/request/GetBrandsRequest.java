package com.trinhminhvi.techshop.brand.dto.request;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GetBrandsRequest {
    @Builder.Default
    @Min(value = 1, message = "Page number must be at least 1")
    private Integer pageNum = 1;

    @Builder.Default
    @Min(value = 1, message = "Page size must be at least 1")
    private Integer pageSize = 5;

    @Builder.Default
    private String sortBy = "brandId";

    @Builder.Default
    private String sortDir = "ASC";

    private String search;
}
