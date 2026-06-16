package com.trinhminhvi.techshop.product.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductImageResponse {
    private String imagePath;
    
    @Builder.Default
    private boolean isThumbnail = false;
}
