package com.trinhminhvi.techshop.dto.response;

import java.time.LocalDateTime;
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
public class UpdateReviewResponse {
    private Integer reviewId;
    private String userName;    
    private String avatarPath;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}
