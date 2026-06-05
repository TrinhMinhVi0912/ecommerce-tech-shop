package com.trinhminhvi.techshop.service;

import org.springframework.data.domain.Pageable;

import com.trinhminhvi.techshop.dto.request.AddReviewRequest;
import com.trinhminhvi.techshop.dto.request.UpdateReviewRequest;
import com.trinhminhvi.techshop.dto.response.AddReviewResponse;
import com.trinhminhvi.techshop.dto.response.ProductReviewResponse;
import com.trinhminhvi.techshop.dto.response.UpdateReviewResponse;

public interface ReviewService {

    public ProductReviewResponse getReview(Pageable pageable, Integer id);
    
    public AddReviewResponse addReview(String userId, Integer productId, AddReviewRequest addReviewRequest);

    public UpdateReviewResponse updateReview(String userId, Integer productId, UpdateReviewRequest updateReviewRequest);

    public void deleteReview(String userId, Integer productId);

}
