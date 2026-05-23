package com.trinhminhvi.techshop.dto.request;

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
    private Integer pageNum = 1;

    @Builder.Default
    private Integer pageSize = 8;
}
