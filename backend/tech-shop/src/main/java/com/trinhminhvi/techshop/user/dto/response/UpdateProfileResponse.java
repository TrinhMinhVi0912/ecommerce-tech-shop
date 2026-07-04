package com.trinhminhvi.techshop.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileResponse {

    private String userId;

    private String email;

    private String userName;

    private String fullName;

    private String phone;

    private String avatarPath;
}