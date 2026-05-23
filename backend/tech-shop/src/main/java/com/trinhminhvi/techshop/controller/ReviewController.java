package com.trinhminhvi.techshop.controller;

import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trinhminhvi.techshop.dto.request.GetReviewsRequest;
import com.trinhminhvi.techshop.dto.response.ApiResponse;
import com.trinhminhvi.techshop.dto.response.ProductReviewResponse;
import com.trinhminhvi.techshop.service.ReviewService;

import lombok.RequiredArgsConstructor;

@RequestMapping("/review")
@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/product/{id}")
    public ApiResponse<ProductReviewResponse> getProductReview(
            @PathVariable(name = "id") Integer id,
            GetReviewsRequest getReviewsRequest) {
        return ApiResponse.<ProductReviewResponse>builder()
                .success(true)
                .message("Get Reviews Successfully")
                .data(reviewService.getReviewFromProduct(
                        PageRequest.of(getReviewsRequest.getPageNum() - 1, getReviewsRequest.getPageSize()),
                        id))
                .build();
    }
}
