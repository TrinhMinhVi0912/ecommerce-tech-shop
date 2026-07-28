package com.trinhminhvi.techshop.user.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.trinhminhvi.techshop.common.ApiResponse;
import com.trinhminhvi.techshop.security.CustomUserDetails;
import com.trinhminhvi.techshop.security.JwtService;
import com.trinhminhvi.techshop.user.dto.request.AddAddressRequest;
import com.trinhminhvi.techshop.user.dto.request.ChangePasswordRequest;
import com.trinhminhvi.techshop.user.dto.request.UpdateProfileUserRequest;
import com.trinhminhvi.techshop.user.dto.response.AddAddressResponse;
import com.trinhminhvi.techshop.user.dto.response.UpdateProfileResponse;
import com.trinhminhvi.techshop.user.dto.response.UserProfileResponse;
import com.trinhminhvi.techshop.user.dto.response.UserResponse;
import com.trinhminhvi.techshop.user.service.AddressService;
import com.trinhminhvi.techshop.user.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
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
                        @AuthenticationPrincipal CustomUserDetails currentUser) {

                return ApiResponse.<UpdateProfileResponse>builder()
                                .success(true)
                                .message("Update Profile User Successfully")
                                .data(userService.updateInfo(updateProfileUserRequest, currentUser.getUserId()))
                                .build();
        }

        @PostMapping("/change-password")
        public ApiResponse<Object> changePassword(
                        @RequestBody @Validated ChangePasswordRequest changePasswordRequest,
                        @AuthenticationPrincipal CustomUserDetails currentUser) {

                userService.updatePassword(changePasswordRequest, currentUser.getUserId());

                return ApiResponse.<Object>builder()
                                .message("Change Password Successflly")
                                .success(true)
                                .data(null)
                                .build();
        }

        @GetMapping("/profile")
        public ApiResponse<UserProfileResponse> getProfile(
                        @AuthenticationPrincipal CustomUserDetails currentUser) {

                return ApiResponse.<UserProfileResponse>builder()
                                .success(true)
                                .message("Get profile successfully")
                                .data(userService.getProfile(currentUser.getUserId()))
                                .build();
        }

        @PatchMapping(value = "/me/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ApiResponse<UserResponse> uploadAvatar(
                        @AuthenticationPrincipal CustomUserDetails currentUser,
                        @RequestPart("avatar") MultipartFile avatar) {

                return ApiResponse.success(
                                userService.uploadAvatar(currentUser.getUserId(), avatar),
                                "Upload avatar successfully");
        }

}
