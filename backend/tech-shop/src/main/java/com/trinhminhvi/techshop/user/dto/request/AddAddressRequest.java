package com.trinhminhvi.techshop.user.dto.request;

import jakarta.validation.constraints.NotBlank;
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
public class AddAddressRequest {

    @NotBlank
    private String addressLine;

    @NotBlank
    private String city;

    @NotBlank
    private String district;

    private boolean defaultAddress;
}