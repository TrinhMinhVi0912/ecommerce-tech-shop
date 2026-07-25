package com.trinhminhvi.techshop.wishlist.dto.response;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WishlistResponse {

    private Integer productId;

    private String name;

    private BigDecimal basePrice;

    @Builder.Default
    private String thumbnailImagePath = "/images/products/default.jpg";

}