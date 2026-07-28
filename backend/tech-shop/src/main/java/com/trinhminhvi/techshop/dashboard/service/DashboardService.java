package com.trinhminhvi.techshop.dashboard.service;

import java.util.List;

import com.trinhminhvi.techshop.dashboard.dto.request.OrderStatisticsRequest;
import com.trinhminhvi.techshop.dashboard.dto.request.RevenueRequest;
import com.trinhminhvi.techshop.dashboard.dto.request.TopProductRequest;
import com.trinhminhvi.techshop.dashboard.dto.response.DashboardSummaryResponse;
import com.trinhminhvi.techshop.dashboard.dto.response.OrderStatisticsResponse;
import com.trinhminhvi.techshop.dashboard.dto.response.RevenueResponse;
import com.trinhminhvi.techshop.dashboard.dto.response.TopProductResponse;

/**
 * DashboardService
 */
public interface DashboardService {

    public DashboardSummaryResponse getSummary();

    public RevenueResponse getRevenue(RevenueRequest request);

    public OrderStatisticsResponse getOrderStatistics(OrderStatisticsRequest request);

    List<TopProductResponse> getTopSellingProducts(TopProductRequest request);
}