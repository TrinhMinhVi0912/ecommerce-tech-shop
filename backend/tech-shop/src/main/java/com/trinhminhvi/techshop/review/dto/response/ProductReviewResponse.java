package com.trinhminhvi.techshop.review.dto.response;

import java.util.List;

import com.trinhminhvi.techshop.common.PageableResponse;

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
public class ProductReviewResponse {
    private SummaryReviewProduct summary;
    private PageableResponse<List<ReviewResponse>> reviews;    
}
