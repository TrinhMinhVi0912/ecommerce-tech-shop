package com.trinhminhvi.techshop.category.dto.request;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GetCategoriesRequest {
    @Builder.Default
    @Min(value = 1, message = "Page number must be at least 1")
    private Integer pageNum = 1;

    @Builder.Default
    @Min(value = 1, message = "Page size must be at least 1")
    private Integer pageSize = 5;

    @Builder.Default
    private String sortBy = "categoryId";

    @Builder.Default
    private String sortDir = "ASC";

    private String search;

    private Integer parentId;
}
