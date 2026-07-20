package com.trinhminhvi.techshop.cart.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.trinhminhvi.techshop.cart.entity.Cart;
import com.trinhminhvi.techshop.user.entity.User;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {

    @EntityGraph(attributePaths = {
            "cartItems",
            "cartItems.productVariant",
            "cartItems.productVariant.product",
            "cartItems.productVariant.product.productImages",
            "cartItems.productVariant.variantAttributes",
            "cartItems.productVariant.variantAttributes.attrValue",
            "cartItems.productVariant.variantAttributes.attrValue.attribute"
    })
    Optional<Cart> findByUser(User user);

}
