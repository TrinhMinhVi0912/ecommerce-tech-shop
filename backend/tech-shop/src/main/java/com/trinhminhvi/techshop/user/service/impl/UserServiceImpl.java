package com.trinhminhvi.techshop.user.service.impl;

import org.springframework.stereotype.Service;

import com.trinhminhvi.techshop.user.dto.request.ChangePasswordRequest;
import com.trinhminhvi.techshop.user.dto.request.UpdateProfileUserRequest;
import com.trinhminhvi.techshop.user.dto.response.UpdateProfileResponse;
import com.trinhminhvi.techshop.user.entity.User;
import com.trinhminhvi.techshop.user.mapper.UserMapper;
import com.trinhminhvi.techshop.user.repository.UserRepository;
import com.trinhminhvi.techshop.user.service.UserService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    
    @Transactional
    @Override
    public UpdateProfileResponse updateInfo(UpdateProfileUserRequest updateProfileUserRequest, String userId) {
        User user = userRepository.findById(userId).orElseThrow(
            () -> new RuntimeException("User Not Found")
        );
        user.setAvatarPath(updateProfileUserRequest.getAvatarPath());
        user.setFullName(updateProfileUserRequest.getFullName());
        user.setPhone(updateProfileUserRequest.getPhone());
        
        return userMapper.toUpdateProfileResponse(user);

    }   

    @Override
    public void updatePassword(ChangePasswordRequest changePasswordRequest, String userId) {
        // TODO Auto-generated method stub
        
    }
    
}
