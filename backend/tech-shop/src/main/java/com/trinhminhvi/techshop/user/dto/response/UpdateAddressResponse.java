package com.trinhminhvi.techshop.user.dto.response;

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
public class UpdateAddressResponse {

    private Integer addressId;

    private String addressLine;

    private String city;

    private String district;

    private boolean defaultAddress;
}
