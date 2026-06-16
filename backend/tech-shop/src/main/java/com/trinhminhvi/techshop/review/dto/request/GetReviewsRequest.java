package com.trinhminhvi.techshop.review.dto.request;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GetReviewsRequest {
    @Builder.Default
    @Min(value = 1, message = "pageNum must be greater than 1")
    private Integer pageNum = 1;

    @Builder.Default
    private Integer pageSize = 8;
}
