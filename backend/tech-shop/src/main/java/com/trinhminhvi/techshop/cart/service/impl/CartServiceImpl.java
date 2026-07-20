package com.trinhminhvi.techshop.cart.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trinhminhvi.techshop.cart.dto.request.AddCartItemRequest;
import com.trinhminhvi.techshop.cart.dto.response.CartItemResponse;
import com.trinhminhvi.techshop.cart.dto.response.CartResponse;
import com.trinhminhvi.techshop.cart.dto.response.VariantAttributeResponse;
import com.trinhminhvi.techshop.cart.entity.Cart;
import com.trinhminhvi.techshop.cart.entity.CartItem;
import com.trinhminhvi.techshop.cart.repository.CartItemRepository;
import com.trinhminhvi.techshop.cart.repository.CartRepository;
import com.trinhminhvi.techshop.cart.service.CartService;
import com.trinhminhvi.techshop.product.entity.AttributeValue;
import com.trinhminhvi.techshop.product.entity.Product;
import com.trinhminhvi.techshop.product.entity.ProductImage;
import com.trinhminhvi.techshop.product.entity.ProductVariant;
import com.trinhminhvi.techshop.product.repository.ProductVariantRepository;
import com.trinhminhvi.techshop.user.entity.User;
import com.trinhminhvi.techshop.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;

    // Các hàm sử dụng chung của các chức năng
    private String getThumbnail(Product product) {

        return product.getProductImages()
                .stream()
                .filter(ProductImage::isThumbnail)
                .findFirst()
                .map(ProductImage::getImagePath)
                .orElse(null);

    }

    private List<VariantAttributeResponse> getVariantAttributes(ProductVariant variant) {

        return variant.getVariantAttributes()
                .stream()
                .map(variantAttribute -> {

                    AttributeValue value = variantAttribute.getAttrValue();

                    return VariantAttributeResponse.builder()
                            .attributeName(value.getAttribute().getName())
                            .value(value.getValue())
                            .build();

                })
                .toList();

    }

    private CartItemResponse buildCartItemResponse(CartItem cartItem) {

        ProductVariant variant = cartItem.getProductVariant();

        Product product = variant.getProduct();

        BigDecimal subTotal = variant.getPrice()
                .multiply(BigDecimal.valueOf(cartItem.getQuantity()));

        return CartItemResponse.builder()
                .cartItemId(cartItem.getCartItemId())
                .variantId(variant.getVariantId())
                .productId(product.getProductId())
                .productName(product.getName())
                .thumbnail(getThumbnail(product))
                .unitPrice(variant.getPrice())
                .quantity(cartItem.getQuantity())
                .subTotal(subTotal)
                .variantAttributes(getVariantAttributes(variant))
                .build();

    }

    private Cart getOrCreateCart(User user) {

        return cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(
                        Cart.builder()
                                .user(user)
                                .build()));
    }

    private void validateStock(ProductVariant variant, int quantity) {

        if (quantity > variant.getStock()) {
            throw new RuntimeException("Insufficient stock");
        }

    }

    // Hàm chức năng

    @Override
    @Transactional(readOnly = true)
    public CartResponse getMyCart(String userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<Cart> optionalCart = cartRepository.findByUser(user);

        if (optionalCart.isEmpty()) {
            return CartResponse.builder()
                    .cartId(null)
                    .totalItems(0)
                    .totalAmount(BigDecimal.ZERO)
                    .items(Collections.emptyList())
                    .build();
        }

        Cart cart = optionalCart.get();

        List<CartItemResponse> itemResponses = new ArrayList<>();

        BigDecimal totalAmount = BigDecimal.ZERO;

        int totalItems = 0;

        for (CartItem cartItem : cart.getCartItems()) {

            CartItemResponse itemResponse = buildCartItemResponse(cartItem);

            itemResponses.add(itemResponse);

            totalAmount = totalAmount.add(itemResponse.getSubTotal());

            totalItems += itemResponse.getQuantity();
        }

        return CartResponse.builder()
                .cartId(cart.getCartId())
                .totalAmount(totalAmount)
                .totalItems(totalItems)
                .items(itemResponses)
                .build();

    }

    @Override
    @Transactional
    public void addCartItem(String userId, AddCartItemRequest request) {

        // 1. Lấy User
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Lấy Variant
        ProductVariant variant = productVariantRepository.findById(request.getVariantId())
                .orElseThrow(() -> new RuntimeException("Product variant not found"));

        // 3. Kiểm tra số lượng hợp lệ
        if (request.getQuantity() <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        // 4. Kiểm tra tồn kho
        if (request.getQuantity() > variant.getStock()) {
            throw new RuntimeException("Insufficient stock");
        }

        // 5. Lấy Cart hoặc tạo mới
        // Cart cart = cartRepository.findByUser(user)
        // .orElseGet(() -> {
        // Cart newCart = Cart.builder()
        // .user(user)
        // .build();
        // return cartRepository.save(newCart);
        // });

        Cart cart = getOrCreateCart(user);

        // 6. Kiểm tra sản phẩm đã có trong giỏ chưa
        Optional<CartItem> optionalCartItem = cartItemRepository.findByCartAndProductVariant(cart, variant);

        if (optionalCartItem.isPresent()) {

            CartItem cartItem = optionalCartItem.get();

            int newQuantity = cartItem.getQuantity() + request.getQuantity();

            // Kiểm tra tồn kho sau khi cộng
            validateStock(variant, newQuantity);

            cartItem.setQuantity(newQuantity);

            cartItemRepository.save(cartItem);

            return;
        }

        // 7. Chưa có -> tạo mới CartItem
        CartItem cartItem = CartItem.builder()
                .cart(cart)
                .productVariant(variant)
                .quantity(request.getQuantity())
                .build();

        cartItemRepository.save(cartItem);
    }

}
