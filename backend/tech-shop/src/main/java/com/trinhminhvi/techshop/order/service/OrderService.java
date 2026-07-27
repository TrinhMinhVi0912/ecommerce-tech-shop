package com.trinhminhvi.techshop.order.service;

import java.util.List;

import com.trinhminhvi.techshop.common.PageableResponse;
import com.trinhminhvi.techshop.order.dto.request.CheckoutRequest;
import com.trinhminhvi.techshop.order.dto.request.GetMyOrdersRequest;
import com.trinhminhvi.techshop.order.dto.request.GetOrdersRequest;
import com.trinhminhvi.techshop.order.dto.request.UpdateOrderStatusRequest;
import com.trinhminhvi.techshop.order.dto.response.CheckoutResponse;
import com.trinhminhvi.techshop.order.dto.response.OrderDetailResponse;
import com.trinhminhvi.techshop.order.dto.response.OrderSummaryForAdminResponse;
import com.trinhminhvi.techshop.order.dto.response.OrderSummaryResponse;

public interface OrderService {

    public CheckoutResponse checkout(String userId, CheckoutRequest request);

    public PageableResponse<List<OrderSummaryResponse>> getMyOrders(String userId, GetMyOrdersRequest request);

    public OrderDetailResponse getMyOrderDetail(String userId, String orderId);

    public void cancelOrder(String userId, String orderId);

    public PageableResponse<List<OrderSummaryForAdminResponse>> getAllOrdersForAdmin(GetOrdersRequest request);

    public void updateOrderStatusForAdmin(String orderId, UpdateOrderStatusRequest request);

}
