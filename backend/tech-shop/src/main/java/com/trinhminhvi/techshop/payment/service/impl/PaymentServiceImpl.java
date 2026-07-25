package com.trinhminhvi.techshop.payment.service.impl;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trinhminhvi.techshop.order.entity.Order;
import com.trinhminhvi.techshop.order.enums.OrderStatus;
import com.trinhminhvi.techshop.order.enums.PaymentMethod;
import com.trinhminhvi.techshop.order.enums.PaymentStatus;
import com.trinhminhvi.techshop.order.repository.OrderRepository;
import com.trinhminhvi.techshop.payment.config.VNPayConfig;
import com.trinhminhvi.techshop.payment.dto.response.CreateVnPayPaymentResponse;
import com.trinhminhvi.techshop.payment.dto.response.VnPayIpnResponse;
import com.trinhminhvi.techshop.payment.entity.Payment;
import com.trinhminhvi.techshop.payment.helper.VnPayHelper;
import com.trinhminhvi.techshop.payment.repository.PaymentRepository;
import com.trinhminhvi.techshop.payment.service.PaymentService;
import com.trinhminhvi.techshop.user.entity.User;
import com.trinhminhvi.techshop.user.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final VNPayConfig vnPayConfig;
    private final VnPayHelper vnPayHelper;

    private Map<String, String> buildPaymentParams(
            Order order,
            Payment payment,
            HttpServletRequest request) {

        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String orderType = "other";
        String bankCode = null;
        String vnp_TxnRef = order.getOrderId();
        String vnp_IpAddr = vnPayHelper.getClientIp(request);
        String vnp_TmnCode = vnPayConfig.getTmnCode();

        Map<String, String> vnp_Params = new HashMap<>();

        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);

        // VNPay yêu cầu nhân 100
        long amount = payment.getAmount()
                .multiply(BigDecimal.valueOf(100))
                .longValue();

        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");

        if (bankCode != null && !bankCode.isEmpty()) {
            vnp_Params.put("vnp_BankCode", bankCode);
        }

        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang:" + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", orderType);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        // Xử lý TimeZone GMT+7 Việt Nam giống ajaxServlet
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");

        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        return vnp_Params;
    }

    /**
     * Dựng URL thanh toán giống hệt ajaxServlet.java của VNPay JSP demo
     */
    private String buildPaymentUrl(Map<String, String> vnp_Params) {
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();

        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);

            if (fieldValue != null && !fieldValue.isEmpty()) {
                try {
                    // Build hash data
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));

                    // Build query
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));

                    if (itr.hasNext()) {
                        query.append('&');
                        hashData.append('&');
                    }
                } catch (Exception e) {
                    throw new RuntimeException("Error encoding payment parameters", e);
                }
            }
        }

        String queryUrl = query.toString();
        String vnp_SecureHash = vnPayHelper.hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;

        return vnPayConfig.getPayUrl() + "?" + queryUrl;
    }

    private void validateCreateVnPayPayment(Order order, Payment payment) {
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("Only pending orders can be paid.");
        }

        if (payment == null) {
            throw new RuntimeException("Payment not found.");
        }

        if (payment.getMethod() != PaymentMethod.VNPAY) {
            throw new RuntimeException("Payment method is not VNPay.");
        }

        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            throw new RuntimeException("Order has already been paid.");
        }

        if (payment.getStatus() == PaymentStatus.CANCELLED) {
            throw new RuntimeException("Payment has been cancelled.");
        }

        if (payment.getStatus() == PaymentStatus.REFUND_PENDING) {
            throw new RuntimeException("Payment is waiting for refund.");
        }

        if (payment.getAmount() == null || payment.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Invalid payment amount.");
        }
    }

    // Helper cho việc xử lý return từ VNPAY gửi về
    private void validateVnPayReturn(
            Map<String, String> params) {

        if (!vnPayHelper.validateSignature(
                new HashMap<>(params),
                vnPayConfig.getHashSecret())) {

            throw new RuntimeException("Invalid VNPay signature.");
        }

        if (!params.containsKey("vnp_TxnRef")) {
            throw new RuntimeException("Missing order id.");
        }

        if (!params.containsKey("vnp_ResponseCode")) {
            throw new RuntimeException("Missing response code.");
        }

    }

    // cập nhật trạng thái thanh toán
    // code 00 (Success) -> Order (Confirm)
    // code 24 (Cancelled) -> Order vẫn giữ Pending cho khách hàng thanh toán lại
    // Khác (51,65,75,.....) -> peding
    private void updatePaymentStatus(
            Payment payment,
            String responseCode,
            String transactionId) {

        payment.setResponseCode(responseCode);
        payment.setTransactionId(transactionId);
        payment.setUpdatedAt(LocalDateTime.now());

        Order order = payment.getOrder();

        switch (responseCode) {

            case "00":

                payment.setStatus(PaymentStatus.SUCCESS);
                payment.setPaidAt(LocalDateTime.now());

                order.setStatus(OrderStatus.CONFIRMED);

                break;

            case "24":

                payment.setStatus(PaymentStatus.CANCELLED);

                // Order vẫn giữ PENDING
                break;

            default:

                payment.setStatus(PaymentStatus.FAILED);

                // Order vẫn giữ PENDING
                break;
        }

    }

    @Override
    @Transactional
    public CreateVnPayPaymentResponse createVnPayPayment(
            String userId,
            String orderId,
            HttpServletRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found."));

        Order order = orderRepository.findByOrderIdAndUser(orderId, user)
                .orElseThrow(() -> new RuntimeException("Order not found."));

        Payment payment = order.getPayment();

        validateCreateVnPayPayment(order, payment);

        Map<String, String> vnpParams = buildPaymentParams(order, payment, request);

        String paymentUrl = buildPaymentUrl(vnpParams);

        payment.setPaymentUrl(paymentUrl);
        paymentRepository.save(payment);

        return CreateVnPayPaymentResponse.builder()
                .paymentUrl(paymentUrl)
                .build();
    }

    // HELPER dành cho IPN

    private void validateVnPayIpn(Map<String, String> params) {

        if (!vnPayHelper.validateSignature(
                new HashMap<>(params),
                vnPayConfig.getHashSecret())) {

            throw new RuntimeException("Invalid VNPay signature.");
        }

        if (!params.containsKey("vnp_TxnRef")) {
            throw new RuntimeException("Missing order id.");
        }

        if (!params.containsKey("vnp_ResponseCode")) {
            throw new RuntimeException("Missing response code.");
        }
    }

    @Override
    @Transactional
    public void handleVnPayReturn(
            Map<String, String> params) {

        System.out.println("================================================");
        params.forEach((k, v) -> System.out.println(k + " = " + v));
        System.out.println("SecureHash = " + params.get("vnp_SecureHash"));
        System.out.println("================================================");
        validateVnPayReturn(params);

        String orderId = params.get("vnp_TxnRef");

        Payment payment = paymentRepository.findByOrderOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found."));

        /*
         * Return URL chỉ là dự phòng thôi cập nhật chính vẫn là IPN
         * Nếu IPN đã xử lý rồi thì không cập nhật nữa.
         */
        if (payment.getStatus() == PaymentStatus.PENDING) {

            updatePaymentStatus(
                    payment,
                    params.get("vnp_ResponseCode"),
                    params.get("vnp_TransactionNo"));

            orderRepository.save(payment.getOrder());
            paymentRepository.save(payment);
        }

    }



    // 00 -> backend nhận IPN thành công chứ không phải thanh toán thành công
    // 02 -> order đã được xác nhận
    // 01 -> Không tìm thấy order
    // 97 -> Sai chữ ký
    @Override
    @Transactional
    public VnPayIpnResponse handleVnPayIpn(
            Map<String, String> params) {

        System.out.println("=================================");
        System.out.println("IPN Chay");
        System.out.println("=================================");


        try {

            validateVnPayIpn(params);

            String orderId = params.get("vnp_TxnRef");

            Payment payment = paymentRepository.findByOrderOrderId(orderId)
                    .orElseThrow(() -> new RuntimeException("Payment not found."));

            /*
             * Đã xử lý trước đó
             */
            if (payment.getStatus() != PaymentStatus.PENDING) {

                return VnPayIpnResponse.builder()
                        .RspCode("02")
                        .Message("Order already confirmed")
                        .build();
            }

            updatePaymentStatus(
                    payment,
                    params.get("vnp_ResponseCode"),
                    params.get("vnp_TransactionNo"));

            orderRepository.save(payment.getOrder());
            paymentRepository.save(payment);

            return VnPayIpnResponse.builder()
                    .RspCode("00")
                    .Message("Confirm Success")
                    .build();

        } catch (RuntimeException ex) {

            if ("Payment not found.".equals(ex.getMessage())) {

                return VnPayIpnResponse.builder()
                        .RspCode("01")
                        .Message("Order not found")
                        .build();
            }

            if ("Invalid VNPay signature.".equals(ex.getMessage())) {

                return VnPayIpnResponse.builder()
                        .RspCode("97")
                        .Message("Invalid signature")
                        .build();
            }

            return VnPayIpnResponse.builder()
                    .RspCode("99")
                    .Message("Unknown error")
                    .build();
        }
    }

}