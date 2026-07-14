package com.trinhminhvi.techshop.user.controller;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trinhminhvi.techshop.common.ApiResponse;
import com.trinhminhvi.techshop.security.JwtService;
import com.trinhminhvi.techshop.user.dto.request.AddAddressRequest;
import com.trinhminhvi.techshop.user.dto.response.AddAddressResponse;
import com.trinhminhvi.techshop.user.service.AddressService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/addresses")
@CrossOrigin("*")
@RequiredArgsConstructor
public class AddressController {

    private final JwtService jwtService;
    private final AddressService addressService;

    @PostMapping
    public ApiResponse<AddAddressResponse> addAddress(
            @RequestBody @Validated AddAddressRequest request,
            HttpServletRequest httpServletRequest) {

        String token = jwtService.extractToken(httpServletRequest);

        String userId = jwtService.extractUserIdFromToken(token);

        return ApiResponse.<AddAddressResponse>builder()
                .success(true)
                .message("Add Address Successfully")
                .data(addressService.addAddress(userId, request))
                .build();
    }
}
