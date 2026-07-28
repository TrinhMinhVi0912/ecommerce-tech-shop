package com.trinhminhvi.techshop.user.controller;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trinhminhvi.techshop.common.ApiResponse;
import com.trinhminhvi.techshop.common.PageableResponse;
import com.trinhminhvi.techshop.security.CustomUserDetails;
import com.trinhminhvi.techshop.user.dto.request.GetUsersRequest;
import com.trinhminhvi.techshop.user.dto.request.UpdateUserStatusRequest;
import com.trinhminhvi.techshop.user.dto.response.UserForAdminResponse;
import com.trinhminhvi.techshop.user.dto.response.UserResponse;
import com.trinhminhvi.techshop.user.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ManageUserController {

        private final UserService userService;

        @GetMapping
        public ApiResponse<PageableResponse<List<UserForAdminResponse>>> getAllUsers(
                        GetUsersRequest request) {

                Sort sort = request.getSortDir().equalsIgnoreCase("ASC")
                                ? Sort.by(request.getSortBy()).ascending()
                                : Sort.by(request.getSortBy()).descending();

                return ApiResponse.success(
                                userService.getAllUsers(
                                                PageRequest.of(
                                                                request.getPageNum() - 1,
                                                                request.getPageSize(),
                                                                sort),
                                                request),
                                "Get Users Successfully");
        }

        @PatchMapping("/{id}/status")
        public ApiResponse<UserForAdminResponse> updateUserStatus(

                        @PathVariable String id,

                        @RequestBody @Validated UpdateUserStatusRequest request,

                        @AuthenticationPrincipal CustomUserDetails currentUser) {

                return ApiResponse.success(

                                userService.updateUserStatus(
                                                currentUser.getUserId(),
                                                id,
                                                request),

                                "Update user status successfully");
        }

}
