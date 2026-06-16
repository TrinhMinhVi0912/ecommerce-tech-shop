package com.trinhminhvi.techshop.review.service;

import org.springframework.data.domain.Pageable;

import com.trinhminhvi.techshop.review.dto.request.AddReviewRequest;
import com.trinhminhvi.techshop.review.dto.request.UpdateReviewRequest;
import com.trinhminhvi.techshop.review.dto.response.AddReviewResponse;
import com.trinhminhvi.techshop.review.dto.response.ProductReviewResponse;
import com.trinhminhvi.techshop.review.dto.response.UpdateReviewResponse;

public interface ReviewService {

    public ProductReviewResponse getReview(Pageable pageable, Integer id, String userId);
    
    public AddReviewResponse addReview(String userId, Integer productId, AddReviewRequest addReviewRequest);

    public UpdateReviewResponse updateReview(String userId, Integer productId, UpdateReviewRequest updateReviewRequest);

    public void deleteReview(String userId, Integer productId);

}
