package com.trinhminhvi.techshop.user.service;

import org.springframework.web.multipart.MultipartFile;

import com.trinhminhvi.techshop.user.dto.request.AddAddressRequest;
import com.trinhminhvi.techshop.user.dto.request.UpdateAddressRequest;
import com.trinhminhvi.techshop.user.dto.response.AddAddressResponse;
import com.trinhminhvi.techshop.user.dto.response.UpdateAddressResponse;
import com.trinhminhvi.techshop.user.dto.response.UserResponse;

import jakarta.servlet.http.HttpServletRequest;

public interface AddressService {

    public AddAddressResponse addAddress(String userId, AddAddressRequest request);

    public void deleteAddress(String userId, Integer addressId);

    public UpdateAddressResponse updateAddress(String userId, Integer addressId, UpdateAddressRequest request);

    public void setDefaultAddress(String userId, Integer addressId);

}