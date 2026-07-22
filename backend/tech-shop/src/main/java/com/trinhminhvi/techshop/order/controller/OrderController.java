package com.trinhminhvi.techshop.order.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trinhminhvi.techshop.common.ApiResponse;
import com.trinhminhvi.techshop.common.PageableResponse;
import com.trinhminhvi.techshop.order.dto.request.CheckoutRequest;
import com.trinhminhvi.techshop.order.dto.request.GetMyOrdersRequest;
import com.trinhminhvi.techshop.order.dto.request.OrderSummaryResponse;
import com.trinhminhvi.techshop.order.dto.response.CheckoutResponse;
import com.trinhminhvi.techshop.order.service.OrderService;
import com.trinhminhvi.techshop.security.JwtService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@CrossOrigin("*")
public class OrderController {

    private final OrderService orderService;
    private final JwtService jwtService;

    @GetMapping
    public ApiResponse<PageableResponse<List<OrderSummaryResponse>>> getMyOrders(
            GetMyOrdersRequest request,
            HttpServletRequest servletRequest) {

        String token = jwtService.extractToken(servletRequest);

        String userId = jwtService.extractUserIdFromToken(token);

        return ApiResponse.<PageableResponse<List<OrderSummaryResponse>>>builder()
                .success(true)
                .message("Get Orders Successfully")
                .data(orderService.getMyOrders(userId, request))
                .build();
    }

    @PostMapping("/checkout")
    public ApiResponse<CheckoutResponse> checkout(
            @RequestBody @Valid CheckoutRequest request,
            HttpServletRequest servletRequest) {

        String token = jwtService.extractToken(servletRequest);

        String userId = jwtService.extractUserIdFromToken(token);

        return ApiResponse.<CheckoutResponse>builder()
                .success(true)
                .message("Checkout successfully")
                .data(orderService.checkout(userId, request))
                .build();
    }
}
