package com.trinhminhvi.techshop.cart.service;

import com.trinhminhvi.techshop.cart.dto.request.AddCartItemRequest;
import com.trinhminhvi.techshop.cart.dto.request.UpdateCartItemRequest;
import com.trinhminhvi.techshop.cart.dto.response.CartResponse;

public interface CartService {

    CartResponse getMyCart(String userId);

    void addCartItem(String userId, AddCartItemRequest request);

    void updateCartItem(String userId, Integer cartItemId, UpdateCartItemRequest request);

    void deleteCartItem(String userId, Integer cartItemId);

}
