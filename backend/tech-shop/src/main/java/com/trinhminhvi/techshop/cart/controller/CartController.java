package com.trinhminhvi.techshop.cart.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trinhminhvi.techshop.cart.dto.request.AddCartItemRequest;
import com.trinhminhvi.techshop.cart.dto.request.UpdateCartItemRequest;
import com.trinhminhvi.techshop.cart.dto.response.CartResponse;
import com.trinhminhvi.techshop.cart.service.CartService;
import com.trinhminhvi.techshop.common.ApiResponse;
import com.trinhminhvi.techshop.security.CustomUserDetails;
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
    public ApiResponse<CartResponse> getMyCart(@AuthenticationPrincipal CustomUserDetails currentUser) {


        return ApiResponse.<CartResponse>builder()
                .success(true)
                .message("Get Cart Successfully")
                .data(cartService.getMyCart(currentUser.getUserId()))
                .build();
    }

    @PostMapping("/items")
    public ApiResponse<Object> addCartItem(
            @RequestBody @Validated AddCartItemRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser) {


        cartService.addCartItem(currentUser.getUserId(), request);

        return ApiResponse.builder()
                .success(true)
                .message("Product added to cart successfully")
                .data(null)
                .build();
    }

    @PutMapping("/items/{cartItemId}")
    public ApiResponse<Object> updateCartItem(
            @PathVariable Integer cartItemId,
            @RequestBody @Validated UpdateCartItemRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser){ 

        cartService.updateCartItem(currentUser.getUserId(), cartItemId, request);

        return ApiResponse.builder()
                .success(true)
                .message("Update cart item successfully")
                .data(null)
                .build();
    }

    @DeleteMapping("/items/{cartItemId}")
    public ApiResponse<Object> deleteCartItem(
            @PathVariable Integer cartItemId,
            @AuthenticationPrincipal CustomUserDetails currentUser) {


        cartService.deleteCartItem(currentUser.getUserId(), cartItemId);

        return ApiResponse.builder()
                .success(true)
                .message("Delete cart item successfully")
                .data(null)
                .build();
    }

}
