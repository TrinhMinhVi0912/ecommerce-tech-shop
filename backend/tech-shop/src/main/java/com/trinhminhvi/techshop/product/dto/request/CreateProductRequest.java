package com.trinhminhvi.techshop.product.dto.request;

import java.math.BigDecimal;
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
@AllArgsConstructor
@NoArgsConstructor
public class CreateProductRequest {
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

    private Integer thumbnailIndex;

    @NotEmpty(message = "Product must have at least one variant")
    @Valid
    private List<CreateVariantRequest> variants;
}
