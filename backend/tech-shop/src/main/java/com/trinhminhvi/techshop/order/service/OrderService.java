package com.trinhminhvi.techshop.order.service;

import java.util.List;

import com.trinhminhvi.techshop.common.PageableResponse;
import com.trinhminhvi.techshop.order.dto.request.CheckoutRequest;
import com.trinhminhvi.techshop.order.dto.request.GetMyOrdersRequest;
import com.trinhminhvi.techshop.order.dto.request.OrderSummaryResponse;
import com.trinhminhvi.techshop.order.dto.response.CheckoutResponse;

public interface OrderService {
    public CheckoutResponse checkout(String userId, CheckoutRequest request);

    PageableResponse<List<OrderSummaryResponse>> getMyOrders(String userId, GetMyOrdersRequest request);
}
