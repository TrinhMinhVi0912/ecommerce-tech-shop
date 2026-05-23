package com.trinhminhvi.techshop.service;

import org.springframework.data.domain.Pageable;

import com.trinhminhvi.techshop.dto.response.ProductReviewResponse;

public interface ReviewService {
    public ProductReviewResponse getReviewFromProduct(Pageable pageable,Integer id);
}
