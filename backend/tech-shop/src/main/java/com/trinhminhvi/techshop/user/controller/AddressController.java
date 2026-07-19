package com.trinhminhvi.techshop.user.controller;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trinhminhvi.techshop.common.ApiResponse;
import com.trinhminhvi.techshop.security.JwtService;
import com.trinhminhvi.techshop.user.dto.request.AddAddressRequest;
import com.trinhminhvi.techshop.user.dto.request.UpdateAddressRequest;
import com.trinhminhvi.techshop.user.dto.response.AddAddressResponse;
import com.trinhminhvi.techshop.user.dto.response.UpdateAddressResponse;
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

    @PutMapping("/{addressId}")
    public ApiResponse<UpdateAddressResponse> updateAddress(

            @PathVariable Integer addressId,

            @RequestBody @Validated UpdateAddressRequest request,

            HttpServletRequest httpServletRequest) {

        String token = jwtService.extractToken(httpServletRequest);

        String userId = jwtService.extractUserIdFromToken(token);

        return ApiResponse.<UpdateAddressResponse>builder()
                .success(true)
                .message("Update Address Successfully")
                .data(addressService.updateAddress(userId, addressId, request))
                .build();
    }

    @DeleteMapping("/{addressId}")
    public ApiResponse<Object> deleteAddress(
            @PathVariable Integer addressId,
            HttpServletRequest request) {

        String token = jwtService.extractToken(request);

        String userId = jwtService.extractUserIdFromToken(token);

        addressService.deleteAddress(userId, addressId);

        return ApiResponse.builder()
                .success(true)
                .message("Delete Address Successfully")
                .data(null)
                .build();
    }

    @PatchMapping("/{addressId}/default")
    public ApiResponse<Object> setDefaultAddress(
            @PathVariable Integer addressId,
            HttpServletRequest request) {

        String token = jwtService.extractToken(request);

        String userId = jwtService.extractUserIdFromToken(token);

        addressService.setDefaultAddress(userId, addressId);

        return ApiResponse.builder()
                .success(true)
                .message("Set Default Address Successfully")
                .data(null)
                .build();
    }

}
