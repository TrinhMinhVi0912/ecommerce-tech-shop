package com.trinhminhvi.techshop.review.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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
public class AddReviewRequest {

    @Min(value = 1)
    @Max(value = 5)
    private Integer rating;
    
    private String comment;
}
