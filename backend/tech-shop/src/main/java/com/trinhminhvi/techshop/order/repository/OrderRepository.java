package com.trinhminhvi.techshop.order.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    // @Query("""
    // SELECT DISTINCT o
    // FROM Order o
    // LEFT JOIN FETCH o.payment
    // LEFT JOIN FETCH o.coupon
    // LEFT JOIN FETCH o.orderItems oi
    // LEFT JOIN FETCH oi.productVariant pv
    // LEFT JOIN FETCH pv.product p
    // LEFT JOIN FETCH p.productImages
    // LEFT JOIN FETCH pv.variantAttributes va
    // LEFT JOIN FETCH va.attrValue av
    // LEFT JOIN FETCH av.attribute
    // WHERE o.orderId = :orderId
    // AND o.user = :user
    // """)
    // Optional<Order> findOrderDetail(
    // @Param("orderId") String orderId,
    // @Param("user") User user);

    @Query("""
            SELECT DISTINCT o
            FROM Order o
            LEFT JOIN FETCH o.payment
            LEFT JOIN FETCH o.coupon
            LEFT JOIN FETCH o.orderItems oi
            LEFT JOIN FETCH oi.productVariant pv
            LEFT JOIN FETCH pv.product p
            WHERE o.orderId=:orderId
            AND o.user=:user
                                    """)
    Optional<Order> findOrderDetail(
            @Param("orderId") String orderId,
            @Param("user") User user);

    @Query("""
            SELECT DISTINCT o
            FROM Order o
            LEFT JOIN FETCH o.payment
            LEFT JOIN FETCH o.coupon
            LEFT JOIN FETCH o.orderItems oi
            LEFT JOIN FETCH oi.productVariant
            WHERE o.orderId = :orderId
            AND o.user = :user
            """)
    Optional<Order> findByOrderIdAndUser(
            @Param("orderId") String orderId,
            @Param("user") User user);

}
