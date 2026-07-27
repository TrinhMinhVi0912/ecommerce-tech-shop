package com.trinhminhvi.techshop.product.dto.request;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.Valid;
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
public class UpdateVariantRequest {

    /**
     * null -> tạo mới
     */
    private Integer variantId;

    @NotNull(message = "Variant price is required")
    private BigDecimal price;

    @NotNull(message = "Variant stock is required")
    private Integer stock;

    private String sku;

    @NotEmpty(message = "Variant must have at least one attribute")
    @Valid
    private List<CreateVariantAttributeRequest> attributes;
}
