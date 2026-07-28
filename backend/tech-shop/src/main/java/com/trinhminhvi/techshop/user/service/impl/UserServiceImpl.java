package com.trinhminhvi.techshop.user.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.trinhminhvi.techshop.common.ImageExtension;
import com.trinhminhvi.techshop.common.PageableResponse;
import com.trinhminhvi.techshop.user.dto.request.ChangePasswordRequest;
import com.trinhminhvi.techshop.user.dto.request.GetUsersRequest;
import com.trinhminhvi.techshop.user.dto.request.UpdateProfileUserRequest;
import com.trinhminhvi.techshop.user.dto.request.UpdateUserStatusRequest;
import com.trinhminhvi.techshop.user.dto.response.UpdateProfileResponse;
import com.trinhminhvi.techshop.user.dto.response.UserForAdminResponse;
import com.trinhminhvi.techshop.user.dto.response.UserProfileResponse;
import com.trinhminhvi.techshop.user.dto.response.UserResponse;
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

    private static final String UPLOAD_DIR = "backend/tech-shop/src/main/resources/static/images/avatars";

    // Helper dành cho uploads avatar

    private void validateAvatar(MultipartFile avatar) {

        if (avatar == null || avatar.isEmpty()) {
            throw new RuntimeException("Avatar cannot be empty.");
        }

        String filename = avatar.getOriginalFilename();

        if (filename == null || !filename.contains(".")) {
            throw new RuntimeException("Invalid avatar file.");
        }

        String extension = filename.substring(filename.lastIndexOf('.') + 1);

        if (!ImageExtension.isSupported(extension)) {
            throw new RuntimeException(
                    "Only jpg, jpeg, png and webp images are allowed.");
        }

        long maxSize = 5 * 1024 * 1024L; // 5MB

        if (avatar.getSize() > maxSize) {
            throw new RuntimeException("Avatar size must not exceed 5MB.");
        }
    }

    private String saveAvatar(MultipartFile avatar) {

        try {
            String originalFilename = avatar.getOriginalFilename();

            String extension = originalFilename.substring(
                    originalFilename.lastIndexOf('.') + 1);

            String newFileName = UUID.randomUUID() + "." + extension;

            Path uploadPath = Paths.get(UPLOAD_DIR);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(newFileName);

            Files.copy(
                    avatar.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING);

            return "/images/avatars/" + newFileName;

        } catch (IOException e) {
            throw new RuntimeException("Upload avatar failed.", e);
        }
    }

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

    private UserResponse buildUserResponse(User user) {
        return UserResponse.builder()
                .userId(user.getUserId())
                .fullName(user.getFullName())
                .avatarUrl(user.getAvatarPath())
                .build();
    }

    private void deleteOldAvatar(User user) {
        String oldAvatarPath = user.getAvatarPath();

        if (oldAvatarPath == null || oldAvatarPath.isBlank()) {
            return;
        }

        try {
            // avatarPath dạng "/images/avatars/xxx.png" -> chỉ lấy tên file
            String fileName = oldAvatarPath.substring(oldAvatarPath.lastIndexOf('/') + 1);

            Path oldFilePath = Paths.get(UPLOAD_DIR).resolve(fileName);

            Files.deleteIfExists(oldFilePath);

        } catch (Exception e) {
            throw new RuntimeException("Error in delete old file process");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(String userId) {

        User user = userRepository.findByIdWithAddresses(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return userMapper.toUserProfileResponse(user);
    }

    @Override
    @Transactional
    public UserResponse uploadAvatar(
            String userId,
            MultipartFile avatar) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found."));

        validateAvatar(avatar);

        String avatarPath = saveAvatar(avatar);

        deleteOldAvatar(user);

        user.setAvatarPath(avatarPath);

        User savedUser = userRepository.save(user);

        return buildUserResponse(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public PageableResponse<List<UserForAdminResponse>> getAllUsers(
            Pageable pageable,
            GetUsersRequest request) {

        Page<User> pageUsers = userRepository.searchUsers(
                request.getSearch(),
                pageable);

        List<UserForAdminResponse> responses = pageUsers.getContent()
                .stream()
                .map(user -> UserForAdminResponse.builder()
                        .userId(user.getUserId())
                        .fullName(user.getFullName())
                        .userName(user.getUserName())
                        .email(user.getEmail())
                        .phone(user.getPhone())
                        .enabled(user.isEnabled())
                        .avatarUrl(user.getAvatarPath())
                        .createdAt(user.getCreatedAt())
                        .build())
                .toList();

        return PageableResponse.<List<UserForAdminResponse>>builder()
                .pageNum(request.getPageNum())
                .pageSize(request.getPageSize())
                .totalElements(pageUsers.getTotalElements())
                .totalPages(pageUsers.getTotalPages())
                .items(responses)
                .build();
    }

    @Override
    @Transactional
    public UserForAdminResponse updateUserStatus(
            String adminId,
            String userId,
            UpdateUserStatusRequest request) {

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Không cho admin tự khóa chính mình
        if (admin.getUserId().equals(user.getUserId())) {
            throw new RuntimeException("You cannot disable your own account.");
        }

        // Không cho khóa tài khoản ADMIN khác
        if ("ADMIN".equalsIgnoreCase(user.getRole().getName())) {
            throw new RuntimeException("Cannot change status of another administrator.");
        }

        user.setEnabled(request.isEnabled());

        userRepository.save(user);

        return UserForAdminResponse.builder()
                .userId(user.getUserId())
                .fullName(user.getFullName())
                .userName(user.getUserName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .enabled(user.isEnabled())
                .avatarUrl(user.getAvatarPath())
                .createdAt(user.getCreatedAt())
                .build();
    }

}
