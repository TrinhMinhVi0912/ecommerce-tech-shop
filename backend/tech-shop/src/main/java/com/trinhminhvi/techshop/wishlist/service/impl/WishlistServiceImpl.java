package com.trinhminhvi.techshop.wishlist.service.impl;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trinhminhvi.techshop.common.PageableResponse;
import com.trinhminhvi.techshop.product.entity.Product;
import com.trinhminhvi.techshop.product.repository.ProductRepository;
import com.trinhminhvi.techshop.user.entity.User;
import com.trinhminhvi.techshop.user.repository.UserRepository;
import com.trinhminhvi.techshop.wishlist.dto.request.GetMyWishlistRequest;
import com.trinhminhvi.techshop.wishlist.dto.response.WishlistResponse;
import com.trinhminhvi.techshop.wishlist.entity.Wishlist;
import com.trinhminhvi.techshop.wishlist.entity.WishlistId;
import com.trinhminhvi.techshop.wishlist.repository.WishlistRepository;
import com.trinhminhvi.techshop.wishlist.service.WishlistService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class WishlistServiceImpl implements WishlistService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final WishlistRepository wishlistRepository;

    @Override
    public void addToWishlist(
            String userId,
            Integer productId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found."));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found."));

        if (wishlistRepository.existsByUserAndProduct(user, product)) {
            throw new RuntimeException("Product already exists in wishlist.");
        }

        Wishlist wishlist = Wishlist.builder()
                .id(WishlistId.builder()
                        .userId(userId)
                        .productId(productId)
                        .build())
                .user(user)
                .product(product)
                .build();

        wishlistRepository.save(wishlist);
    }

    @Override
    public void removeFromWishlist(
            String userId,
            Integer productId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found."));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found."));

        if (!wishlistRepository.existsByUserAndProduct(user, product)) {
            throw new RuntimeException("Product not found in wishlist.");
        }

        wishlistRepository.deleteByUserAndProduct(user, product);
    }

    @Override
    @Transactional(readOnly = true)
    public PageableResponse<List<WishlistResponse>> getMyWishlist(
            String userId,
            GetMyWishlistRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found."));

        // Sort sort = Sort.by(
        //         Sort.Direction.fromString(request.getSortDir()),
        //         request.getSortBy());

        Pageable pageable = PageRequest.of(
                request.getPageNum() - 1,
                request.getPageSize()
            );

        Page<Wishlist> wishlistPage = wishlistRepository.findByUser(user, pageable);

        List<WishlistResponse> responses = wishlistPage.getContent()
                .stream()
                .map(wishlist -> {

                    Product product = wishlist.getProduct();

                    return WishlistResponse.builder()
                            .productId(product.getProductId())
                            .name(product.getName())
                            .basePrice(product.getBasePrice())
                            .thumbnailImagePath(product.getThumbnailPath())
                            .build();
                })
                .toList();

        return PageableResponse.<List<WishlistResponse>>builder()
                .pageNum(request.getPageNum())
                .pageSize(request.getPageSize())
                .totalElements(wishlistPage.getTotalElements())
                .totalPages(wishlistPage.getTotalPages())
                .items(responses)
                .build();
    }
}
