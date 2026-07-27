package com.trinhminhvi.techshop.product.dto.request;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProductRequest {

    @NotBlank(message = "Product name is required")
    private String name;

    @NotBlank(message = "Product description is required")
    private String description;

    @NotNull(message = "Base price is required")
    private BigDecimal basePrice;

    @NotNull(message = "Brand ID is required")
    private Integer brandId;

    @NotNull(message = "Category ID is required")
    private Integer categoryId;

    /**
     * Đường dẫn ảnh cũ cần giữ lại.
     */
    @Builder.Default
    private List<String> existingImages = new ArrayList<>();

    /**
     * Thumbnail sau khi update.
     * Có thể là:
     * /images/products/abc.jpg
     * hoặc
     * new_0
     */
    @NotBlank(message = "Thumbnail is required")
    private String thumbnail;

    @NotEmpty(message = "Product must have at least one variant")
    @Valid
    private List<UpdateVariantRequest> variants;
}
