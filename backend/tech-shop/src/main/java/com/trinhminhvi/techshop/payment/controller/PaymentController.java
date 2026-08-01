package com.trinhminhvi.techshop.payment.controller;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.HashMap;
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
import jakarta.servlet.http.HttpServletResponse;
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
        public void vnPayReturn(
                        @RequestParam Map<String, String> params,
                        HttpServletResponse response) throws IOException {

                // ✅ Log tất cả params nhận được từ VNPay
                System.out.println("🔍 VNPay Return Params:");
                params.forEach((key, value) -> {
                        System.out.println(key + " = " + value);
                });

                // Xử lý thanh toán
                paymentService.handleVnPayReturn(params);

                // ✅ Kiểm tra response code
                String responseCode = params.get("vnp_ResponseCode");
                String transactionStatus = params.get("vnp_TransactionStatus");

                System.out.println("✅ Response Code: " + responseCode);
                System.out.println("✅ Transaction Status: " + transactionStatus);

                // ✅ Redirect về frontend với đầy đủ params
                String frontendUrl = "http://localhost:5173/vnpay-return";
                StringBuilder redirectUrl = new StringBuilder(frontendUrl);
                redirectUrl.append("?");

                for (Map.Entry<String, String> entry : params.entrySet()) {
                        try {
                                redirectUrl.append(entry.getKey())
                                                .append("=")
                                                .append(URLEncoder.encode(entry.getValue(), "UTF-8"))
                                                .append("&");
                        } catch (UnsupportedEncodingException e) {
                                // Bỏ qua
                        }
                }

                System.out.println("🔀 Redirect URL: " + redirectUrl.toString());

                // ✅ Redirect về frontend
                response.sendRedirect(redirectUrl.toString());
        }

        @GetMapping("/vnpay/ipn")
        public VnPayIpnResponse vnPayIpn(
                        @RequestParam Map<String, String> params) {

                return paymentService.handleVnPayIpn(params);
        }

}
