package com.trinhminhvi.techshop.review.dto.response;

import java.math.BigDecimal;
import java.util.Map;

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
public class SummaryReviewProduct {
    private BigDecimal averageRating;
    private Integer totalReviews;
    private Map<Integer,Long> ratingBreakdown;
}
