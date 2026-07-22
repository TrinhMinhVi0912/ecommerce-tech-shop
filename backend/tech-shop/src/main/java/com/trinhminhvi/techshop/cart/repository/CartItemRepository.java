package com.trinhminhvi.techshop.cart.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.trinhminhvi.techshop.cart.entity.Cart;
import com.trinhminhvi.techshop.cart.entity.CartItem;
import com.trinhminhvi.techshop.product.entity.ProductVariant;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {

        Optional<CartItem> findByCartAndProductVariant(
                        Cart cart,
                        ProductVariant productVariant);

        List<CartItem> findByCartCartIdAndCartItemIdIn(
                        Integer cartId,
                        List<Integer> cartItemIds);

        @Query("""
                            SELECT ci
                            FROM CartItem ci
                            JOIN FETCH ci.productVariant pv
                            JOIN FETCH pv.product p
                            WHERE ci.cart.cartId = :cartId
                              AND ci.cartItemId IN :cartItemIds
                        """)
        List<CartItem> findCheckoutItems(
                        @Param("cartId") Integer cartId,
                        @Param("cartItemIds") List<Integer> cartItemIds);

        @Modifying
        @Query(value = """
                        DELETE
                        FROM cart_items
                        WHERE cart_item_id IN (:cartItemIds)
                        """, nativeQuery = true)
        int deleteAllNative(
                        @Param("cartItemIds") List<Integer> cartItemIds);

}