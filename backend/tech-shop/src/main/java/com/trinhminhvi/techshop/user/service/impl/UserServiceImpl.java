package com.trinhminhvi.techshop.user.service.impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trinhminhvi.techshop.user.dto.request.ChangePasswordRequest;
import com.trinhminhvi.techshop.user.dto.request.UpdateProfileUserRequest;
import com.trinhminhvi.techshop.user.dto.response.UpdateProfileResponse;
import com.trinhminhvi.techshop.user.dto.response.UserProfileResponse;
import com.trinhminhvi.techshop.user.entity.User;
import com.trinhminhvi.techshop.user.mapper.UserMapper;
import com.trinhminhvi.techshop.user.repository.UserRepository;
import com.trinhminhvi.techshop.user.service.UserService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    private final PasswordEncoder passwordEncoder;

    @Transactional
    @Override
    public UpdateProfileResponse updateInfo(UpdateProfileUserRequest updateProfileUserRequest, String userId) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new RuntimeException("User Not Found"));
        user.setAvatarPath(updateProfileUserRequest.getAvatarPath());
        user.setFullName(updateProfileUserRequest.getFullName());
        user.setPhone(updateProfileUserRequest.getPhone());

        return userMapper.toUpdateProfileResponse(user);

    }

    @Override
    @Transactional
    public void updatePassword(ChangePasswordRequest changePasswordRequest, String userId) {

        User user = userRepository.findById(userId).orElseThrow(
                () -> new RuntimeException("User not found"));

        if (!changePasswordRequest.getNewPassword().equals(changePasswordRequest.getConfirmPassword())) {
            throw new RuntimeException("Confirm password dont match");
        }

        if (changePasswordRequest.getNewPassword().equals(changePasswordRequest.getOldPassword())) {
            throw new RuntimeException("New password must be different from current password");
        }

        if (!passwordEncoder.matches(changePasswordRequest.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(String userId) {

        User user = userRepository.findByIdWithAddresses(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return userMapper.toUserProfileResponse(user);
    }

}
