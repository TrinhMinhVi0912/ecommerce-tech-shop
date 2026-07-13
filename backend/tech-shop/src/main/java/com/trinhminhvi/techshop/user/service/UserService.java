package com.trinhminhvi.techshop.user.service;

import com.trinhminhvi.techshop.user.dto.request.ChangePasswordRequest;
import com.trinhminhvi.techshop.user.dto.request.UpdateProfileUserRequest;
import com.trinhminhvi.techshop.user.dto.response.UpdateProfileResponse;
import com.trinhminhvi.techshop.user.dto.response.UserProfileResponse;

public interface UserService {
    UpdateProfileResponse updateInfo(UpdateProfileUserRequest updateProfileUserRequest, String userId);
    void updatePassword(ChangePasswordRequest changePasswordRequest, String userId);
    UserProfileResponse getProfile(String userId);
}