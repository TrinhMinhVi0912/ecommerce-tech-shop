package com.trinhminhvi.techshop.user.service;

import com.trinhminhvi.techshop.user.dto.request.AddAddressRequest;
import com.trinhminhvi.techshop.user.dto.request.UpdateAddressRequest;
import com.trinhminhvi.techshop.user.dto.response.AddAddressResponse;
import com.trinhminhvi.techshop.user.dto.response.UpdateAddressResponse;

public interface AddressService {

    AddAddressResponse addAddress(String userId, AddAddressRequest request);

    void deleteAddress(String userId, Integer addressId);

    UpdateAddressResponse updateAddress(String userId, Integer addressId, UpdateAddressRequest request);

    void setDefaultAddress(String userId, Integer addressId);   

}