package com.trinhminhvi.techshop.auth.dto.request;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    private String userName;
    private String password;
}
