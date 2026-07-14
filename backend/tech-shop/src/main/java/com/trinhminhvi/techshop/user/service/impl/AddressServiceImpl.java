package com.trinhminhvi.techshop.user.service.impl;

import org.springframework.stereotype.Service;
import com.trinhminhvi.techshop.user.dto.request.AddAddressRequest;
import com.trinhminhvi.techshop.user.dto.response.AddAddressResponse;
import com.trinhminhvi.techshop.user.entity.Address;
import com.trinhminhvi.techshop.user.entity.User;
import com.trinhminhvi.techshop.user.mapper.AddressMapper;
import com.trinhminhvi.techshop.user.repository.AddressRepository;
import com.trinhminhvi.techshop.user.repository.UserRepository;
import com.trinhminhvi.techshop.user.service.AddressService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final AddressMapper addressMapper;

    @Override
    @Transactional
    public AddAddressResponse addAddress(String userId, AddAddressRequest request) {

        // Lấy thông tin người dùng
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Chuyển Request sang Entity
        Address address = addressMapper.toAddress(request);

        // Gán chủ sở hữu địa chỉ
        address.setUser(user);

        // Kiểm tra người dùng đã có địa chỉ nào chưa
        boolean hasAddress = addressRepository.existsByUser(user);

        if (!hasAddress) {
            // Địa chỉ đầu tiên luôn là địa chỉ mặc định
            address.setDefaultAddress(true);
        } else if (address.isDefaultAddress()) {

            // Nếu người dùng muốn đặt địa chỉ mới làm mặc định
            // thì bỏ mặc định tất cả các địa chỉ cũ
            
            addressRepository.clearDefaultAddress(user);
        }

        // Lưu địa chỉ
        Address savedAddress = addressRepository.save(address);

        // Trả về Response
        return addressMapper.toAddAddressResponse(savedAddress);
    }
}