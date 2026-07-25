package com.trinhminhvi.techshop.payment.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.trinhminhvi.techshop.order.entity.Order;
import com.trinhminhvi.techshop.payment.entity.Payment;
import com.trinhminhvi.techshop.user.entity.User;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    Optional<Payment> findByOrder(Order order);

    Optional<Payment> findByOrderOrderIdAndOrderUser(
            String orderId,
            User user);

    Optional<Payment> findByOrderOrderId(String orderId);
}
