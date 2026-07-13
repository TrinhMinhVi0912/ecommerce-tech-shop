package com.trinhminhvi.techshop.user.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trinhminhvi.techshop.common.ApiResponse;
import com.trinhminhvi.techshop.security.JwtService;
import com.trinhminhvi.techshop.user.dto.request.ChangePasswordRequest;
import com.trinhminhvi.techshop.user.dto.request.UpdateProfileUserRequest;
import com.trinhminhvi.techshop.user.dto.response.UpdateProfileResponse;
import com.trinhminhvi.techshop.user.dto.response.UserProfileResponse;
import com.trinhminhvi.techshop.user.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/users")
@CrossOrigin("*")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    @PostMapping("/change-profile")
    public ApiResponse<UpdateProfileResponse> updateProfile(
            @RequestBody UpdateProfileUserRequest updateProfileUserRequest,
            HttpServletRequest httpServletRequest) {
        String token = jwtService.extractToken(httpServletRequest);
        String userId = jwtService.extractUserIdFromToken(token);
        return ApiResponse.<UpdateProfileResponse>builder()
                .success(true)
                .message("Update Profile User Successfully")
                .data(userService.updateInfo(updateProfileUserRequest, userId))
                .build();
    }

    @PostMapping("/change-password")
    public ApiResponse<Object> changePassword(
            @RequestBody @Validated ChangePasswordRequest changePasswordRequest,
            HttpServletRequest httpServletRequest) {
        String token = jwtService.extractToken(httpServletRequest);
        String userId = jwtService.extractUserIdFromToken(token);

        userService.updatePassword(changePasswordRequest, userId);

        return ApiResponse.<Object>builder()
                .message("Change Password Successflly")
                .success(true)
                .data(null)
                .build();
    }

    @GetMapping("/profile")
    public ApiResponse<UserProfileResponse> getProfile(
            HttpServletRequest request) {

        String token = jwtService.extractToken(request);

        String userId = jwtService.extractUserIdFromToken(token);

        return ApiResponse.<UserProfileResponse>builder()
                .success(true)
                .message("Get profile successfully")
                .data(userService.getProfile(userId))
                .build();
    }

}
