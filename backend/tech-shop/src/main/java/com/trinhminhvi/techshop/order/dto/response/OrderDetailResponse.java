package com.trinhminhvi.techshop.order.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.trinhminhvi.techshop.order.enums.OrderStatus;
import com.trinhminhvi.techshop.order.enums.PaymentMethod;
import com.trinhminhvi.techshop.order.enums.PaymentProvider;
import com.trinhminhvi.techshop.order.enums.PaymentStatus;

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
public class OrderDetailResponse {

    private String orderId;

    private String receiverName;

    private String receiverPhone;

    private String receiverAddress;

    private String receiverDistrict;

    private String receiverCity;

    private String note;

    private PaymentMethod paymentMethod;

    private PaymentProvider paymentProvider;

    private PaymentStatus paymentStatus;

    private OrderStatus orderStatus;

    private BigDecimal totalPrice;

    private BigDecimal discountAmount;

    private BigDecimal finalPrice;

    private String couponCode;

    private LocalDateTime createdAt;

    private List<OrderItemDetailResponse> items;

}