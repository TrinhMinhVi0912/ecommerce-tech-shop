package com.trinhminhvi.techshop.order.enums;

public enum OrderStatus {

    PENDING,       // Đã đặt hàng, chờ xác nhận

    CONFIRMED,     // Admin đã xác nhận

    PROCESSING,    // Đang chuẩn bị hàng

    SHIPPING,      // Đang giao

    DELIVERED,     // Đã giao thành công

    COMPLETED,     // Đơn hoàn tất

    CANCELLED      // Đã hủy

}