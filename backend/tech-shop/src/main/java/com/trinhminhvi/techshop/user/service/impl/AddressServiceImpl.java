package com.trinhminhvi.techshop.user.service.impl;

import org.springframework.stereotype.Service;
import com.trinhminhvi.techshop.user.dto.request.AddAddressRequest;
import com.trinhminhvi.techshop.user.dto.request.UpdateAddressRequest;
import com.trinhminhvi.techshop.user.dto.response.AddAddressResponse;
import com.trinhminhvi.techshop.user.dto.response.UpdateAddressResponse;
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

    private Address getAddressOfCurrentUser(String userId, Integer addressId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return addressRepository.findByAddressIdAndUser(addressId, user)
                .orElseThrow(() -> new RuntimeException("Address not found"));
    }

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

    @Override
    @Transactional
    public void deleteAddress(String userId, Integer addressId) {

        // Lấy User
        User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));

        // // Lấy Address của chính User
        // Address address = addressRepository
        // .findByAddressIdAndUser(addressId, user)
        // .orElseThrow(() -> new RuntimeException("Address not found"));

        Address address = getAddressOfCurrentUser(userId, addressId);

        boolean isDefault = address.isDefaultAddress();

        // Xóa địa chỉ
        addressRepository.delete(address);

        // Nếu không phải địa chỉ mặc định thì kết thúc
        if (!isDefault) {
            return;
        }

        // Lấy địa chỉ khác (nếu còn)
        addressRepository
                .findFirstByUserAndAddressIdNotOrderByAddressIdAsc(user, addressId)
                .ifPresent(a -> {
                    a.setDefaultAddress(true);
                    addressRepository.save(a);
                });
    }

    @Override
    @Transactional
    public UpdateAddressResponse updateAddress(
            String userId,
            Integer addressId,
            UpdateAddressRequest request) {

        // User user = userRepository.findById(userId)
        // .orElseThrow(() -> new RuntimeException("User not found"));

        // Address address = addressRepository
        // .findByAddressIdAndUser(addressId, user)
        // .orElseThrow(() -> new RuntimeException("Address not found"));

        Address address = getAddressOfCurrentUser(userId, addressId);

        address.setAddressLine(request.getAddressLine());
        address.setCity(request.getCity());
        address.setDistrict(request.getDistrict());

        Address saved = addressRepository.save(address);

        return addressMapper.toUpdateAddressResponse(saved);
    }

    @Override
    @Transactional
    public void setDefaultAddress(String userId, Integer addressId) {

        // Lấy User
        User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));

        // // Lấy Address của User
        // Address address = addressRepository
        // .findByAddressIdAndUser(addressId, user)
        // .orElseThrow(() -> new RuntimeException("Address not found"));

        Address address = getAddressOfCurrentUser(userId, addressId);

        // Nếu đã là mặc định thì không cần xử lý
        if (address.isDefaultAddress()) {
            return;
        }

        // Bỏ mặc định tất cả địa chỉ cũ
        addressRepository.clearDefaultAddress(user);

        // Đặt địa chỉ hiện tại làm mặc định
        address.setDefaultAddress(true);

        addressRepository.save(address);
    }

}