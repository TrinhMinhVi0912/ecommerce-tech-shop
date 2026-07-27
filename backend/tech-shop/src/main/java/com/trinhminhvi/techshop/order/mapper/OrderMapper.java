package com.trinhminhvi.techshop.order.mapper;

import org.mapstruct.Mapper;

import com.trinhminhvi.techshop.order.dto.response.OrderSummaryForAdminResponse;
import com.trinhminhvi.techshop.order.entity.Order;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    OrderSummaryForAdminResponse toOrderSummaryForAdminResponse(Order order);
}
