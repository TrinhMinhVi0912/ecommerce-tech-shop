package com.trinhminhvi.techshop.auth.dto.request;

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
public class RegisterRequest {
    private String userName;
    private String email;
    private String password;
    private String fullName;
    private String phone;
}