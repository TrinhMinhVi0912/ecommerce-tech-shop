package com.trinhminhvi.techshop.review.controller;

import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trinhminhvi.techshop.common.ApiResponse;
import com.trinhminhvi.techshop.review.dto.request.AddReviewRequest;
import com.trinhminhvi.techshop.review.dto.request.GetReviewsRequest;
import com.trinhminhvi.techshop.review.dto.request.UpdateReviewRequest;
import com.trinhminhvi.techshop.review.dto.response.AddReviewResponse;
import com.trinhminhvi.techshop.review.dto.response.ProductReviewResponse;
import com.trinhminhvi.techshop.review.dto.response.UpdateReviewResponse;
import com.trinhminhvi.techshop.review.service.ReviewService;
import com.trinhminhvi.techshop.security.CustomUserDetails;
import com.trinhminhvi.techshop.security.JwtService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RequestMapping("/reviews")
@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final JwtService jwtService;


    @GetMapping("/{productId}")
    public ApiResponse<ProductReviewResponse> getProductReview(
            @PathVariable Integer productId,
            @Validated @ModelAttribute GetReviewsRequest getReviewsRequest,
            HttpServletRequest httpServletRequest) {

        int pageNum = (getReviewsRequest.getPageNum() == null || getReviewsRequest.getPageNum() < 1) ? 1 
                : getReviewsRequest.getPageNum();
        int pageSize = (getReviewsRequest.getPageSize() == null || getReviewsRequest.getPageSize() < 1) ? 10 
                : getReviewsRequest.getPageSize();

        String userId = null;

        try {
            String token = jwtService.extractToken(httpServletRequest);
            if (token != null && !token.isEmpty()) {
                userId = jwtService.extractUserIdFromToken(token);
            }
        } catch (Exception e) {
            // Khách chưa đăng nhập hoặc token không hợp lệ
        }

        getReviewsRequest.setPageNum(pageNum);
        getReviewsRequest.setPageSize(pageSize);

        return ApiResponse.<ProductReviewResponse>builder()
                .success(true)
                .message("Get Reviews Successfully")
                .data(reviewService.getReview(
                        PageRequest.of(getReviewsRequest.getPageNum() - 1,
                                getReviewsRequest.getPageSize()),
                        productId, userId))
                .build();
    }

    @PostMapping("/{productId}")
    public ApiResponse<AddReviewResponse> addReview(
            @Validated @RequestBody AddReviewRequest addReviewRequest,
            @PathVariable Integer productId,
            @AuthenticationPrincipal CustomUserDetails currentUser) {

        if (currentUser == null) {
            return ApiResponse.<AddReviewResponse>builder()
                    .success(false)
                    .message("User not authenticated. Please login to add review.")
                    .build();
        }

        return ApiResponse.<AddReviewResponse>builder()
                .success(true)
                .message("Add Review Successfully")
                .data(reviewService.addReview(currentUser.getUserId(), productId, addReviewRequest))
                .build();
    }

    @PutMapping("/{productId}")
    public ApiResponse<UpdateReviewResponse> updateReview(
            @PathVariable Integer productId,
            @Validated @RequestBody UpdateReviewRequest updateReviewRequest,
            @AuthenticationPrincipal CustomUserDetails currentUser) {

        if (currentUser == null) {
            return ApiResponse.<UpdateReviewResponse>builder()
                    .success(false)
                    .message("User not authenticated. Please login to update review.")
                    .build();
        }

        return ApiResponse.<UpdateReviewResponse>builder()
                .success(true)
                .message("Update review successfully")
                .data(reviewService.updateReview(currentUser.getUserId(), productId, updateReviewRequest))
                .build();
    }

    @DeleteMapping("/{productId}")
    public ApiResponse<Object> deleteReview(
            @PathVariable Integer productId,
            @AuthenticationPrincipal CustomUserDetails currentUser) {

        if (currentUser == null) {
            return ApiResponse.<Object>builder()
                    .success(false)
                    .message("User not authenticated. Please login to delete review.")
                    .build();
        }

        reviewService.deleteReview(currentUser.getUserId(), productId);

        return ApiResponse.<Object>builder()
                .success(true)
                .message("Delete review successfully")
                .build();
    }
}