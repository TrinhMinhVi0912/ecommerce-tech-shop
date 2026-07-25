package com.trinhminhvi.techshop.wishlist.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trinhminhvi.techshop.common.ApiResponse;
import com.trinhminhvi.techshop.common.PageableResponse;
import com.trinhminhvi.techshop.security.JwtService;
import com.trinhminhvi.techshop.wishlist.dto.request.GetMyWishlistRequest;
import com.trinhminhvi.techshop.wishlist.dto.response.WishlistResponse;
import com.trinhminhvi.techshop.wishlist.service.WishlistService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/wishlist")
@RequiredArgsConstructor
@CrossOrigin("*")
public class WishlistController {

    private final WishlistService wishlistService;

    private final JwtService jwtService;

    @PostMapping("/{productId}")
    public ApiResponse<Void> addToWishlist(
            @PathVariable Integer productId,
            HttpServletRequest request) {

        String token = jwtService.extractToken(request);

        String userId = jwtService.extractUserIdFromToken(token);

        wishlistService.addToWishlist(userId, productId);

        return ApiResponse.<Void>builder()
                .success(true)
                .message("Add product to wishlist successfully.")
                .build();
    }

    @DeleteMapping("/{productId}")
    public ApiResponse<Void> removeFromWishlist(
            @PathVariable Integer productId,
            HttpServletRequest request) {

        String token = jwtService.extractToken(request);

        String userId = jwtService.extractUserIdFromToken(token);

        wishlistService.removeFromWishlist(userId, productId);

        return ApiResponse.<Void>builder()
                .success(true)
                .message("Remove product from wishlist successfully.")
                .build();
    }

    @GetMapping
    public ApiResponse<PageableResponse<List<WishlistResponse>>> getMyWishlist(
            GetMyWishlistRequest request,
            HttpServletRequest servletRequest) {

        String token = jwtService.extractToken(servletRequest);

        String userId = jwtService.extractUserIdFromToken(token);

        return ApiResponse.<PageableResponse<List<WishlistResponse>>>builder()
                .success(true)
                .message("Get wishlist successfully.")
                .data(wishlistService.getMyWishlist(userId, request))
                .build();
    }

}
