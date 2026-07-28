package com.trinhminhvi.techshop.dashboard.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trinhminhvi.techshop.common.ApiResponse;
import com.trinhminhvi.techshop.dashboard.dto.request.OrderStatisticsRequest;
import com.trinhminhvi.techshop.dashboard.dto.request.RevenueRequest;
import com.trinhminhvi.techshop.dashboard.dto.request.TopProductRequest;
import com.trinhminhvi.techshop.dashboard.dto.response.DashboardSummaryResponse;
import com.trinhminhvi.techshop.dashboard.dto.response.OrderStatisticsResponse;
import com.trinhminhvi.techshop.dashboard.dto.response.RevenueResponse;
import com.trinhminhvi.techshop.dashboard.dto.response.TopProductResponse;
import com.trinhminhvi.techshop.dashboard.service.DashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/dashboard")
@RequiredArgsConstructor
@CrossOrigin("*")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ApiResponse<DashboardSummaryResponse> getSummary() {

        return ApiResponse.success(
                dashboardService.getSummary(),
                "Get dashboard summary successfully");
    }

    @GetMapping("/revenue")
    public ApiResponse<RevenueResponse> getRevenue(

            @ModelAttribute RevenueRequest request) {

        return ApiResponse.success(
                dashboardService.getRevenue(request),
                "Get revenue successfully");
    }

    @GetMapping("/orders")
    public ApiResponse<OrderStatisticsResponse> getOrderStatistics(
            @ModelAttribute OrderStatisticsRequest request) {

        return ApiResponse.success(
                dashboardService.getOrderStatistics(request),
                "Get order statistics successfully");
    }

    @GetMapping("/top-products")
    public ApiResponse<List<TopProductResponse>> getTopProducts(
            @ModelAttribute TopProductRequest request) {

        return ApiResponse.success(
                dashboardService.getTopSellingProducts(request),
                "Get top selling products successfully");
    }
}
