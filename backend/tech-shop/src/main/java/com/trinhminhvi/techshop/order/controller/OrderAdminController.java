package com.trinhminhvi.techshop.order.controller;

import java.util.List;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trinhminhvi.techshop.common.ApiResponse;
import com.trinhminhvi.techshop.common.PageableResponse;
import com.trinhminhvi.techshop.order.dto.request.GetOrdersRequest;
import com.trinhminhvi.techshop.order.dto.request.UpdateOrderStatusRequest;
import com.trinhminhvi.techshop.order.dto.response.OrderDetailResponse;
import com.trinhminhvi.techshop.order.dto.response.OrderSummaryForAdminResponse;
import com.trinhminhvi.techshop.order.dto.response.OrderSummaryResponse;
import com.trinhminhvi.techshop.order.service.OrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/orders")
@CrossOrigin("*")
@RequiredArgsConstructor
public class OrderAdminController {

    private final OrderService orderService;

    @GetMapping
    public ApiResponse<PageableResponse<List<OrderSummaryForAdminResponse>>> getAllOrdersForAdmin(
            @ModelAttribute GetOrdersRequest request) {

        return ApiResponse.<PageableResponse<List<OrderSummaryForAdminResponse>>>builder()
                .success(true)
                .message("Get all orders successfully")
                .data(orderService.getAllOrdersForAdmin(request))
                .build();
    }

    @GetMapping("/{orderId}")
    public ApiResponse<OrderDetailResponse> getOrderDetailForAdmin(
            @PathVariable String orderId) {

        return ApiResponse.<OrderDetailResponse>builder()
                .success(true)
                .message("Get order detail successfully")
                .data(orderService.getOrderDetailForAdmin(orderId))
                .build();
    }

    @PatchMapping("/{orderId}/status")
    public ApiResponse<Object> updateOrderStatus(
            @PathVariable String orderId,
            @RequestBody @Validated UpdateOrderStatusRequest request) {

        orderService.updateOrderStatusForAdmin(orderId, request);

        return ApiResponse.builder()
                .success(true)
                .message("Update order status successfully")
                .data(null)
                .build();
    }

}
