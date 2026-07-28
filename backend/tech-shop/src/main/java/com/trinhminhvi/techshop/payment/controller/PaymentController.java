package com.trinhminhvi.techshop.payment.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trinhminhvi.techshop.common.ApiResponse;
import com.trinhminhvi.techshop.payment.dto.response.CreateVnPayPaymentResponse;
import com.trinhminhvi.techshop.payment.dto.response.VnPayIpnResponse;
import com.trinhminhvi.techshop.payment.service.PaymentService;
import com.trinhminhvi.techshop.security.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RequestMapping("/payment")
@RestController
@CrossOrigin("*")
@RequiredArgsConstructor
public class PaymentController {

        private final PaymentService paymentService;

        private final JwtService jwtService;

        @PostMapping("/vnpay/{orderId}")
        public ApiResponse<CreateVnPayPaymentResponse> createVnPayPayment(
                        @PathVariable String orderId,
                        HttpServletRequest request) {

                String token = jwtService.extractToken(request);

                String userId = jwtService.extractUserIdFromToken(token);

                return ApiResponse.<CreateVnPayPaymentResponse>builder()
                                .success(true)
                                .message("Create VNPay payment successfully")
                                .data(paymentService.createVnPayPayment(
                                                userId,
                                                orderId,
                                                request))
                                .build();
        }

        @GetMapping("/vnpay/return")
        public ApiResponse<Void> vnPayReturn(
                        @RequestParam Map<String, String> params) {

                paymentService.handleVnPayReturn(params);

                return ApiResponse.<Void>builder()
                                .success(true)
                                .message("VNPay payment processed successfully.")
                                .build();
        }

        @GetMapping("/vnpay/ipn")
        public VnPayIpnResponse vnPayIpn(
                        @RequestParam Map<String, String> params) {

                return paymentService.handleVnPayIpn(params);
        }

}
