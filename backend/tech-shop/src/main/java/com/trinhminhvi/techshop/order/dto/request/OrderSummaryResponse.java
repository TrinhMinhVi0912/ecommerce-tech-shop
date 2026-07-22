package com.trinhminhvi.techshop.order.dto.request;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.trinhminhvi.techshop.order.enums.OrderStatus;
import com.trinhminhvi.techshop.order.enums.PaymentMethod;
import com.trinhminhvi.techshop.order.enums.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderSummaryResponse {

    private String orderId;

    private String thumbnail;

    private String productName;

    private Integer totalProduct;

    private BigDecimal finalPrice;

    private PaymentMethod paymentMethod;

    private PaymentStatus paymentStatus;

    private OrderStatus orderStatus;

    private LocalDateTime createdAt;

}
