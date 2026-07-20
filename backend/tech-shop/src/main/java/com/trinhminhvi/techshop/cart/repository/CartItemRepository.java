package com.trinhminhvi.techshop.cart.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.trinhminhvi.techshop.cart.entity.Cart;
import com.trinhminhvi.techshop.cart.entity.CartItem;
import com.trinhminhvi.techshop.product.entity.ProductVariant;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {

    Optional<CartItem> findByCartAndProductVariant(
            Cart cart,
            ProductVariant productVariant
    );


}