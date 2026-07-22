package com.trinhminhvi.techshop.order.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewAddressRequest {

    @NotBlank
    private String addressLine;

    @NotBlank
    private String district;

    @NotBlank
    private String city;

    private boolean defaultAddress;

}
