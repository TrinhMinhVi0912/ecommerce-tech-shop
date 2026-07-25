package com.trinhminhvi.techshop.payment.service;

import java.util.Map;

import com.trinhminhvi.techshop.payment.dto.request.CreateVNPayPaymentRequest;
import com.trinhminhvi.techshop.payment.dto.response.CreateVnPayPaymentResponse;
import com.trinhminhvi.techshop.payment.dto.response.VnPayIpnResponse;

import jakarta.servlet.http.HttpServletRequest;

public interface PaymentService {
    
    CreateVnPayPaymentResponse createVnPayPayment(String userId, String orderId, HttpServletRequest request);

    void handleVnPayReturn(Map<String, String> params);

    VnPayIpnResponse handleVnPayIpn(Map<String, String> params);
}
