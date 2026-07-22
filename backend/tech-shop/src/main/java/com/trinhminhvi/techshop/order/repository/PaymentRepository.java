package com.trinhminhvi.techshop.order.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.trinhminhvi.techshop.order.entity.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment,String>{
    
}
