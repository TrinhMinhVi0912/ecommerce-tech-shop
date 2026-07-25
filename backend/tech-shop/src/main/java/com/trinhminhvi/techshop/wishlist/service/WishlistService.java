package com.trinhminhvi.techshop.wishlist.service;

import java.util.List;

import com.trinhminhvi.techshop.common.PageableResponse;
import com.trinhminhvi.techshop.wishlist.dto.request.GetMyWishlistRequest;
import com.trinhminhvi.techshop.wishlist.dto.response.WishlistResponse;

public interface WishlistService {
    void addToWishlist(
            String userId,
            Integer productId);

    void removeFromWishlist(
            String userId,
            Integer productId);

    PageableResponse<List<WishlistResponse>> getMyWishlist(
            String userId,
            GetMyWishlistRequest request);
}
