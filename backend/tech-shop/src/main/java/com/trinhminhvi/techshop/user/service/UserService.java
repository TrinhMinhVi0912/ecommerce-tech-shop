package com.trinhminhvi.techshop.user.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.trinhminhvi.techshop.common.PageableResponse;
import com.trinhminhvi.techshop.user.dto.request.ChangePasswordRequest;
import com.trinhminhvi.techshop.user.dto.request.GetUsersRequest;
import com.trinhminhvi.techshop.user.dto.request.UpdateProfileUserRequest;
import com.trinhminhvi.techshop.user.dto.request.UpdateUserStatusRequest;
import com.trinhminhvi.techshop.user.dto.response.UpdateProfileResponse;
import com.trinhminhvi.techshop.user.dto.response.UserForAdminResponse;
import com.trinhminhvi.techshop.user.dto.response.UserProfileResponse;
import com.trinhminhvi.techshop.user.dto.response.UserResponse;

public interface UserService {
    public UpdateProfileResponse updateInfo(UpdateProfileUserRequest updateProfileUserRequest, String userId);

    public void updatePassword(ChangePasswordRequest changePasswordRequest, String userId);

    public UserProfileResponse getProfile(String userId);

    public UserResponse uploadAvatar(String userId, MultipartFile avatar);

    public PageableResponse<List<UserForAdminResponse>> getAllUsers(Pageable pageable, GetUsersRequest request);

    UserForAdminResponse updateUserStatus(String adminId, String userId, UpdateUserStatusRequest request);

}