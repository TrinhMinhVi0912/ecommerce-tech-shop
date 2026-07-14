package com.trinhminhvi.techshop.user.service;

import com.trinhminhvi.techshop.user.dto.request.AddAddressRequest;
import com.trinhminhvi.techshop.user.dto.response.AddAddressResponse;

public interface AddressService {

    AddAddressResponse addAddress(String userId,AddAddressRequest request);

}