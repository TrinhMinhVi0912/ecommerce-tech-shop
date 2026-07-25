package com.trinhminhvi.techshop.brand.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateBrandRequest {
    @NotBlank(message = "Brand name is required")
    private String name;
}
