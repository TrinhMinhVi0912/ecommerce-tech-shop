package com.trinhminhvi.techshop.order.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.trinhminhvi.techshop.order.entity.Order;
import com.trinhminhvi.techshop.order.enums.OrderStatus;
import com.trinhminhvi.techshop.user.entity.User;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

    Page<Order> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);

    Page<Order> findByUserAndStatusOrderByCreatedAtDesc(User user, OrderStatus status, Pageable pageable);

    @EntityGraph(attributePaths = {
            "payment",
            "coupon",
            "orderItems",
            "orderItems.productVariant",
            "orderItems.productVariant.product",
            "orderItems.productVariant.product.productImages"
    })
    List<Order> findByOrderIdIn(List<String> orderIds);

}
