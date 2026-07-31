package com.trinhminhvi.techshop.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDetailResponse {
    private String userId;
    private String userName;
    private String email;
    private String fullName;
    private String phone;
    private String role;
    private String avatarUrl;
}