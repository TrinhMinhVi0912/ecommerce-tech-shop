package com.trinhminhvi.techshop.product.dto.request;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
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
public class CreateVariantAttributeRequest {
    @NotBlank(message = "Attribute name is required")
    @JsonAlias({"name"})
    private String attributeName;

    @NotBlank(message = "Attribute value is required")
    @JsonAlias({"value"})
    private String attributeValue;
}
