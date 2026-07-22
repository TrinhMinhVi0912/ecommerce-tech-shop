package com.trinhminhvi.techshop.order.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;
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
public class CheckoutResponse {

    private String orderId;

    private PaymentMethod paymentMethod;

    private PaymentStatus paymentStatus;

    private OrderStatus orderStatus;

    private BigDecimal totalPrice;

    private BigDecimal discountAmount;

    private BigDecimal finalPrice;

    //chỉ có khi thanh toán online
    private String paymentUrl;

    private LocalDateTime createdAt;

}