package com.trinhminhvi.techshop.cart.controller;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trinhminhvi.techshop.cart.dto.request.AddCartItemRequest;
import com.trinhminhvi.techshop.cart.dto.response.CartResponse;
import com.trinhminhvi.techshop.cart.service.CartService;
import com.trinhminhvi.techshop.common.ApiResponse;
import com.trinhminhvi.techshop.security.JwtService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RequestMapping("/cart")
@RestController
@CrossOrigin("*")
@RequiredArgsConstructor
public class CartController {

    private final JwtService jwtService;
    private final CartService cartService;

    @GetMapping
    public ApiResponse<CartResponse> getMyCart(HttpServletRequest request) {

        String token = jwtService.extractToken(request);

        String userId = jwtService.extractUserIdFromToken(token);

        return ApiResponse.<CartResponse>builder()
                .success(true)
                .message("Get Cart Successfully")
                .data(cartService.getMyCart(userId))
                .build();
    }

    @PostMapping("/items")
    public ApiResponse<Object> addCartItem(
            @RequestBody @Validated AddCartItemRequest request,
            HttpServletRequest servletRequest) {

        String token = jwtService.extractToken(servletRequest);

        String userId = jwtService.extractUserIdFromToken(token);

        cartService.addCartItem(userId, request);

        return ApiResponse.builder()
                .success(true)
                .message("Product added to cart successfully")
                .data(null)
                .build();
    }

}
