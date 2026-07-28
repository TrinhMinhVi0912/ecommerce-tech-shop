package com.trinhminhvi.techshop.user.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
import com.trinhminhvi.techshop.security.CustomUserDetails;
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
            @AuthenticationPrincipal CustomUserDetails currentUser) {


        return ApiResponse.<AddAddressResponse>builder()
                .success(true)
                .message("Add Address Successfully")
                .data(addressService.addAddress(currentUser.getUserId(), request))
                .build();
    }

    @PutMapping("/{addressId}")
    public ApiResponse<UpdateAddressResponse> updateAddress(

            @PathVariable Integer addressId,

            @RequestBody @Validated UpdateAddressRequest request,

            @AuthenticationPrincipal CustomUserDetails currentUser) {

        return ApiResponse.<UpdateAddressResponse>builder()
                .success(true)
                .message("Update Address Successfully")
                .data(addressService.updateAddress(currentUser.getUserId(), addressId, request))
                .build();
    }

    @DeleteMapping("/{addressId}")
    public ApiResponse<Object> deleteAddress(
            @PathVariable Integer addressId,
            @AuthenticationPrincipal CustomUserDetails currentUser) {

        addressService.deleteAddress(currentUser.getUserId(), addressId);

        return ApiResponse.builder()
                .success(true)
                .message("Delete Address Successfully")
                .data(null)
                .build();
    }

    @PatchMapping("/{addressId}/default")
    public ApiResponse<Object> setDefaultAddress(
            @PathVariable Integer addressId,
            @AuthenticationPrincipal CustomUserDetails currentUser) {

        addressService.setDefaultAddress(currentUser.getUserId(), addressId);

        return ApiResponse.builder()
                .success(true)
                .message("Set Default Address Successfully")
                .data(null)
                .build();
    }

}
