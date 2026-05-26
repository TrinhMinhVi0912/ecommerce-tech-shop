package com.trinhminhvi.techshop.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trinhminhvi.techshop.dto.request.AddReviewRequest;
import com.trinhminhvi.techshop.dto.response.AddReviewResponse;
import com.trinhminhvi.techshop.dto.response.PageableResponse;
import com.trinhminhvi.techshop.dto.response.ProductReviewResponse;
import com.trinhminhvi.techshop.dto.response.ReviewResponse;
import com.trinhminhvi.techshop.dto.response.SummaryReviewProduct;
import com.trinhminhvi.techshop.dto.response.UserResponse;
import com.trinhminhvi.techshop.entity.Review;
import com.trinhminhvi.techshop.entity.User;
import com.trinhminhvi.techshop.entity.Product;
import com.trinhminhvi.techshop.repository.ReviewRepository;
import com.trinhminhvi.techshop.repository.UserRepository;
import com.trinhminhvi.techshop.repository.ProductRepository;
import com.trinhminhvi.techshop.service.ReviewService;

import io.micrometer.common.lang.NonNull;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService{

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    public ProductReviewResponse getReviewFromProduct(Pageable pageable, Integer productId) {

        Page<Review> pageProductReviewResponse = reviewRepository.findAllByProduct(pageable, productId);

        List<ReviewResponse> listProductReviewResponse = pageProductReviewResponse
                .getContent()
                .stream()
                .map(
                        rw -> {
                            ReviewResponse reviewResponse = ReviewResponse.builder()
                                    .reviewId(rw.getReviewId())
                                    .rating(rw.getRating())
                                    .comment(rw.getComment())
                                    .createdAt(rw.getCreatedAt())
                                    .user(UserResponse.builder()
                                            .userId(rw.getUser().getUserId())
                                            .fullName(rw.getUser().getFullName())
                                            .avatarUrl(rw.getUser().getAvatarPath())
                                            .build())
                                    .build();
                            return reviewResponse;
                        })
                .toList();

        Object result = reviewRepository.getReviewSummary(productId);

        Object[] summaryData = (Object[]) result;

        BigDecimal averageRating = summaryData[0] != null
                ? BigDecimal.valueOf(
                        ((Number) summaryData[0]).doubleValue()).setScale(1, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        Long totalReviews = summaryData[1] != null
                ? ((Number) summaryData[1]).longValue()
                : 0L;

        List<Object[]> breakdownData = reviewRepository.countRatingBreakdown(productId);

        // Khởi tạo Map
        Map<Integer, Long> ratingBreakdown = new HashMap<>();

        ratingBreakdown.put(1, 0L);
        ratingBreakdown.put(2, 0L);
        ratingBreakdown.put(3, 0L);
        ratingBreakdown.put(4, 0L);
        ratingBreakdown.put(5, 0L);

        // Cập nhật giá trị
        for (Object[] row : breakdownData) {

            Integer rating = (Integer) row[0];
            Long count = (Long) row[1];

            ratingBreakdown.put(rating, count);
        }

        SummaryReviewProduct summary = SummaryReviewProduct.builder()
                .averageRating(averageRating)
                .totalReviews(totalReviews.intValue())
                .ratingBreakdown(ratingBreakdown)
                .build();

        return ProductReviewResponse.builder()
                .summary(summary)
                .reviews(PageableResponse.<List<ReviewResponse>>builder()
                        .pageNum(pageProductReviewResponse.getNumber() + 1)
                        .pageSize(pageProductReviewResponse.getSize())
                        .totalElements(pageProductReviewResponse.getTotalElements())
                        .totalPages(pageProductReviewResponse.getTotalPages())
                        .items(listProductReviewResponse)
                        .build())
                .build();
    }

    @Transactional
    @Override
    public AddReviewResponse addReviewForProduct(String email,Integer productId, AddReviewRequest addReviewRequest) {

        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("product not found"));


        if(reviewRepository.findByUserAndProduct(user, product).isPresent()){
                throw new RuntimeException("You already review this product");
        }


        Review review = Review.builder()
        .comment(addReviewRequest.getComment())
        .rating(addReviewRequest.getRating())
        .user(user)
        .product(product)
        .build();


        Review reviewSave = reviewRepository.save(review);


        return AddReviewResponse.builder()
        .userName(user.getUserName())
        .reviewId(reviewSave.getReviewId())
        .rating(reviewSave.getRating())
        .comment(reviewSave.getComment())
        .createdAt(reviewSave.getCreatedAt())
        .build();
    }


}
