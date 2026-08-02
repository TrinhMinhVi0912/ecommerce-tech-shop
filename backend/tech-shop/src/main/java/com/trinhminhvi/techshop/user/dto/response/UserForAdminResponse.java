package com.trinhminhvi.techshop.user.dto.response;

import java.time.LocalDateTime;

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
    public class UserForAdminResponse {

        private String userId;

        private String fullName;

        private String userName;

        private String email;

        private String phone;

        private Boolean enabled;

        private String avatarUrl;

        private LocalDateTime createdAt;
    }
