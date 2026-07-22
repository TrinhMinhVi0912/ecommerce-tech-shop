package com.trinhminhvi.techshop.order.dto.internal;

import com.trinhminhvi.techshop.order.dto.request.CheckoutRequest;
import com.trinhminhvi.techshop.user.entity.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

// Lớp này là lớp dùng để phục vụ các nghiệp vụ dưới service không nhận request từ khách hàng 

@Getter
@Builder
@AllArgsConstructor
public class CheckoutAddress {

    private String receiverName;

    private String receiverPhone;

    private String addressLine;

    private String district;

    private String city;


}
