package com.trinhminhvi.techshop.service;

import org.springframework.data.domain.Pageable;

import com.trinhminhvi.techshop.dto.request.AddReviewRequest;
import com.trinhminhvi.techshop.dto.response.AddReviewResponse;
import com.trinhminhvi.techshop.dto.response.ProductReviewResponse;

public interface ReviewService {
    public ProductReviewResponse getReviewFromProduct(Pageable pageable, Integer id);

    public AddReviewResponse addReviewForProduct(String email, Integer productId, AddReviewRequest addReviewRequest);
}
