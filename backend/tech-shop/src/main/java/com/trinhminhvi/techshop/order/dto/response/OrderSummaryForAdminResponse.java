package com.trinhminhvi.techshop.order.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.trinhminhvi.techshop.order.enums.OrderStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderSummaryForAdminResponse {

    private String orderId;

    private String receiverName;

    private String receiverPhone;

    private BigDecimal finalPrice;

    private OrderStatus status;

    private LocalDateTime createdAt;
}
