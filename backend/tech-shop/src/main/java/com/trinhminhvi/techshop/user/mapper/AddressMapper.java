package com.trinhminhvi.techshop.user.mapper;

import org.mapstruct.Mapper;

import com.trinhminhvi.techshop.user.dto.request.AddAddressRequest;
import com.trinhminhvi.techshop.user.dto.response.AddAddressResponse;
import com.trinhminhvi.techshop.user.entity.Address;

@Mapper(componentModel = "spring")
public interface AddressMapper {

    Address toAddress(AddAddressRequest request);

    AddAddressResponse toAddAddressResponse(Address address);

}
