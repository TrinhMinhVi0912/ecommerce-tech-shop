package com.trinhminhvi.techshop.dashboard.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trinhminhvi.techshop.dashboard.dto.request.OrderStatisticsRequest;
import com.trinhminhvi.techshop.dashboard.dto.request.RevenueRequest;
import com.trinhminhvi.techshop.dashboard.dto.request.TopProductRequest;
import com.trinhminhvi.techshop.dashboard.dto.response.DashboardSummaryResponse;
import com.trinhminhvi.techshop.dashboard.dto.response.OrderStatisticItemResponse;
import com.trinhminhvi.techshop.dashboard.dto.response.OrderStatisticsResponse;
import com.trinhminhvi.techshop.dashboard.dto.response.RevenueItemResponse;
import com.trinhminhvi.techshop.dashboard.dto.response.RevenueResponse;
import com.trinhminhvi.techshop.dashboard.dto.response.TopProductResponse;
import com.trinhminhvi.techshop.dashboard.service.DashboardService;
import com.trinhminhvi.techshop.order.enums.OrderStatus;
import com.trinhminhvi.techshop.order.repository.OrderItemRepository;
import com.trinhminhvi.techshop.order.repository.OrderRepository;
import com.trinhminhvi.techshop.product.repository.ProductRepository;
import com.trinhminhvi.techshop.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    // Helper dành cho lấy doanh thu theo tháng năm

    private List<RevenueItemResponse> buildMonthlyRevenue(Integer year) {

        if (year == null) {
            throw new RuntimeException("Year is required.");
        }

        List<Object[]> result = orderRepository.revenueByMonth(year);

        Map<Integer, BigDecimal> revenueMap = result.stream()
                .collect(Collectors.toMap(
                        row -> ((Number) row[0]).intValue(),
                        row -> (BigDecimal) row[1]));

        List<RevenueItemResponse> items = new ArrayList<>();

        for (int month = 1; month <= 12; month++) {

            items.add(
                    RevenueItemResponse.builder()
                            .label("Tháng " + month)
                            .revenue(
                                    revenueMap.getOrDefault(
                                            month,
                                            BigDecimal.ZERO))
                            .build());
        }

        return items;
    }

    private List<RevenueItemResponse> buildQuarterRevenue(Integer year) {

        if (year == null) {
            throw new RuntimeException("Year is required.");
        }

        List<Object[]> result = orderRepository.revenueByQuarter(year);

        Map<Integer, BigDecimal> revenueMap = result.stream()
                .collect(Collectors.toMap(
                        row -> ((Number) row[0]).intValue(),
                        row -> (BigDecimal) row[1]));

        List<RevenueItemResponse> items = new ArrayList<>();

        for (int quarter = 1; quarter <= 4; quarter++) {

            items.add(
                    RevenueItemResponse.builder()
                            .label("Quý " + quarter)
                            .revenue(
                                    revenueMap.getOrDefault(
                                            quarter,
                                            BigDecimal.ZERO))
                            .build());
        }

        return items;
    }

    private List<RevenueItemResponse> buildYearRevenue() {

        List<Object[]> result = orderRepository.revenueByYear();

        return result.stream()
                .map(row -> RevenueItemResponse.builder()
                        .label(String.valueOf(((Number) row[0]).intValue()))
                        .revenue((BigDecimal) row[1])
                        .build())
                .toList();
    }

    // Helper lấy số lương order theo tuần, tháng, quý, năm
    private List<OrderStatisticItemResponse> buildWeeklyOrders(Integer year) {

        if (year == null) {
            throw new RuntimeException("Year is required.");
        }

        List<Object[]> result = orderRepository.orderByWeek(year);

        Map<Integer, Long> orderMap = result.stream()
                .collect(Collectors.toMap(
                        row -> ((Number) row[0]).intValue(),
                        row -> ((Number) row[1]).longValue()));

        List<OrderStatisticItemResponse> items = new ArrayList<>();

        for (int week = 1; week <= 53; week++) {

            items.add(
                    OrderStatisticItemResponse.builder()
                            .label("Tuần " + week)
                            .totalOrders(
                                    orderMap.getOrDefault(
                                            week,
                                            0L))
                            .build());
        }

        return items;
    }

    private List<OrderStatisticItemResponse> buildMonthlyOrders(Integer year) {

        if (year == null) {
            throw new RuntimeException("Year is required.");
        }

        List<Object[]> result = orderRepository.orderByMonth(year);

        Map<Integer, Long> orderMap = result.stream()
                .collect(Collectors.toMap(
                        row -> ((Number) row[0]).intValue(),
                        row -> ((Number) row[1]).longValue()));

        List<OrderStatisticItemResponse> items = new ArrayList<>();

        for (int month = 1; month <= 12; month++) {

            items.add(
                    OrderStatisticItemResponse.builder()
                            .label("Tháng " + month)
                            .totalOrders(
                                    orderMap.getOrDefault(
                                            month,
                                            0L))
                            .build());
        }

        return items;
    }

    private List<OrderStatisticItemResponse> buildQuarterOrders(Integer year) {

        if (year == null) {
            throw new RuntimeException("Year is required.");
        }

        List<Object[]> result = orderRepository.orderByQuarter(year);

        Map<Integer, Long> orderMap = result.stream()
                .collect(Collectors.toMap(
                        row -> ((Number) row[0]).intValue(),
                        row -> ((Number) row[1]).longValue()));

        List<OrderStatisticItemResponse> items = new ArrayList<>();

        for (int quarter = 1; quarter <= 4; quarter++) {

            items.add(
                    OrderStatisticItemResponse.builder()
                            .label("Quý " + quarter)
                            .totalOrders(
                                    orderMap.getOrDefault(
                                            quarter,
                                            0L))
                            .build());
        }

        return items;
    }

    private List<OrderStatisticItemResponse> buildYearOrders() {

        List<Object[]> result = orderRepository.orderByYear();

        return result.stream()
                .map(row -> OrderStatisticItemResponse.builder()
                        .label(String.valueOf(((Number) row[0]).intValue()))
                        .totalOrders(((Number) row[1]).longValue())
                        .build())
                .toList();
    }

    // Helper tìm top sản phẩm hot
    private void validateTopProductRequest(
            TopProductRequest request) {

        if (request.getType() == null) {
            throw new RuntimeException("Dashboard type is required.");
        }

        if (request.getYear() == null) {
            throw new RuntimeException("Year is required.");
        }

        switch (request.getType()) {

            case MONTH -> {

                if (request.getMonth() == null) {
                    throw new RuntimeException("Month is required.");
                }

                if (request.getMonth() < 1 || request.getMonth() > 12) {
                    throw new RuntimeException("Month must be from 1 to 12.");
                }
            }

            case QUARTER -> {

                if (request.getQuarter() == null) {
                    throw new RuntimeException("Quarter is required.");
                }

                if (request.getQuarter() < 1 || request.getQuarter() > 4) {
                    throw new RuntimeException("Quarter must be from 1 to 4.");
                }
            }

            default -> {
            }
        }
    }

    private TopProductResponse mapTopProductResponse(
            Object[] row) {

        return TopProductResponse.builder()
                .productId(
                        ((Number) row[0]).intValue())

                .productName(
                        (String) row[1])

                .thumbnail(
                        (String) row[2])

                .brandName(
                        (String) row[3])

                .categoryName(
                        (String) row[4])

                .totalSold(
                        ((Number) row[5]).longValue())

                .revenue(
                        (BigDecimal) row[6])

                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardSummaryResponse getSummary() {

        long totalUsers = userRepository.countByEnabledTrue();

        long totalProducts = productRepository.countByIsActiveTrue();

        long totalOrders = orderRepository.countByStatus(
                OrderStatus.COMPLETED);

        BigDecimal totalRevenue = orderRepository.getTotalRevenue(
                OrderStatus.COMPLETED);

        return DashboardSummaryResponse.builder()
                .totalEnableUsers(totalUsers)
                .totalActiveProducts(totalProducts)
                .totalCompleteOrders(totalOrders)
                .totalRevenue(totalRevenue)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public RevenueResponse getRevenue(RevenueRequest request) {

        List<RevenueItemResponse> items;

        switch (request.getType()) {

            case MONTH ->
                items = buildMonthlyRevenue(request.getYear());

            case QUARTER ->
                items = buildQuarterRevenue(request.getYear());

            case YEAR ->
                items = buildYearRevenue();

            default ->
                throw new RuntimeException("Unsupported dashboard period");
        }

        BigDecimal totalRevenue = items.stream()
                .map(RevenueItemResponse::getRevenue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return RevenueResponse.builder()
                .totalRevenue(totalRevenue)
                .items(items)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public OrderStatisticsResponse getOrderStatistics(
            OrderStatisticsRequest request) {

        List<OrderStatisticItemResponse> items;

        switch (request.getType()) {

            case WEEK ->
                items = buildWeeklyOrders(request.getYear());

            case MONTH ->
                items = buildMonthlyOrders(request.getYear());

            case QUARTER ->
                items = buildQuarterOrders(request.getYear());

            case YEAR ->
                items = buildYearOrders();

            default ->
                throw new RuntimeException("Unsupported dashboard period");
        }

        Long totalOrders = items.stream()
                .mapToLong(OrderStatisticItemResponse::getTotalOrders)
                .sum();

        return OrderStatisticsResponse.builder()
                .totalOrders(totalOrders)
                .items(items)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TopProductResponse> getTopSellingProducts(
            TopProductRequest request) {

        validateTopProductRequest(request);

        LocalDateTime startDate;
        LocalDateTime endDate;

        switch (request.getType()) {

            case YEAR -> {

                startDate = LocalDate.of(
                        request.getYear(),
                        1,
                        1)
                        .atStartOfDay();

                endDate = LocalDate.of(
                        request.getYear(),
                        12,
                        31)
                        .atTime(23, 59, 59);
            }

            case MONTH -> {

                YearMonth yearMonth = YearMonth.of(
                        request.getYear(),
                        request.getMonth());

                startDate = yearMonth.atDay(1)
                        .atStartOfDay();

                endDate = yearMonth.atEndOfMonth()
                        .atTime(23, 59, 59);
            }

            case QUARTER -> {

                int startMonth = (request.getQuarter() - 1) * 3 + 1;

                startDate = LocalDate.of(
                        request.getYear(),
                        startMonth,
                        1)
                        .atStartOfDay();

                int endMonth = startMonth + 2;

                endDate = LocalDate.of(
                        request.getYear(),
                        endMonth,
                        YearMonth.of(request.getYear(), endMonth)
                                .lengthOfMonth())
                        .atTime(23, 59, 59);
            }

            default ->
                throw new RuntimeException("Unsupported dashboard type");
        }

        List<Object[]> result = orderItemRepository.findTopSellingProducts(
                startDate,
                endDate);

        return result.stream()
                .map(this::mapTopProductResponse)
                .toList();
    }

}
