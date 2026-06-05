package com.trinhminhvi.techshop.controller;

import org.springframework.data.domain.PageRequest;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trinhminhvi.techshop.dto.request.AddReviewRequest;
import com.trinhminhvi.techshop.dto.request.GetReviewsRequest;
import com.trinhminhvi.techshop.dto.request.UpdateReviewRequest;
import com.trinhminhvi.techshop.dto.response.AddReviewResponse;
import com.trinhminhvi.techshop.dto.response.ApiResponse;
import com.trinhminhvi.techshop.dto.response.ProductReviewResponse;
import com.trinhminhvi.techshop.dto.response.UpdateReviewResponse;
import com.trinhminhvi.techshop.security.JwtService;
import com.trinhminhvi.techshop.service.ReviewService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RequestMapping("/products/{productId}/reviews")
@RestController
@RequiredArgsConstructor
public class ReviewController {

        private final ReviewService reviewService;
        private final JwtService jwtService;

        @GetMapping
        public ApiResponse<ProductReviewResponse> getProductReview(
                        @PathVariable Integer productId,
                        @Validated @ModelAttribute GetReviewsRequest getReviewsRequest) {



                int pageNum = (getReviewsRequest.getPageNum() == null || getReviewsRequest.getPageNum() < 1) ?  1 : getReviewsRequest.getPageNum();
                int pageSize = ( getReviewsRequest.getPageSize() == null || getReviewsRequest.getPageSize() < 1) ? 10 : getReviewsRequest.getPageSize();

                getReviewsRequest.setPageNum(pageNum);
                getReviewsRequest.setPageSize(pageSize);

                return ApiResponse.<ProductReviewResponse>builder()
                                .success(true)
                                .message("Get Reviews Successfully")
                                .data(reviewService.getReview(
                                                PageRequest.of(getReviewsRequest.getPageNum() - 1,
                                                                getReviewsRequest.getPageSize()),
                                                productId))
                                .build();
        }

        @PostMapping
        public ApiResponse<AddReviewResponse> addReview(
                        @Validated @RequestBody AddReviewRequest addReviewRequest,
                        @PathVariable Integer productId,
                        HttpServletRequest httpServletRequest) {
                String token = jwtService.extractToken(httpServletRequest);

                String userId = jwtService.extractUserIdFromToken(token);

                return ApiResponse.<AddReviewResponse>builder()
                                .success(true)
                                .message("Add Review Successfully")
                                .data(reviewService.addReview(userId, productId, addReviewRequest))
                                .build();
        }

        @PutMapping
        public ApiResponse<UpdateReviewResponse> updateReview(
                        @PathVariable Integer productId,
                        @Validated @RequestBody UpdateReviewRequest updateReviewRequest,
                        HttpServletRequest httpServletRequest) {

                String token = jwtService.extractToken(httpServletRequest);

                String userId = jwtService.extractUserIdFromToken(token);

                return ApiResponse.<UpdateReviewResponse>builder()
                                .success(true)
                                .message("Update review successfully")
                                .data(reviewService.updateReview(userId, productId, updateReviewRequest))
                                .build();

        }

        @DeleteMapping
        public ApiResponse<Object> deleteReview(
                        @PathVariable Integer productId,
                        HttpServletRequest httpServletRequest) {

                String token = jwtService.extractToken(httpServletRequest);

                String userId = jwtService.extractUserIdFromToken(token);

                reviewService.deleteReview(userId, productId);

                return ApiResponse.<Object>builder()
                .success(true)
                .message("Delete review successfully")
                .build();
        }

}
