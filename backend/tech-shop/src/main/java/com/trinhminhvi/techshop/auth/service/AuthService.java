package com.trinhminhvi.techshop.auth.service;

import com.trinhminhvi.techshop.auth.dto.request.LoginRequest;
import com.trinhminhvi.techshop.auth.dto.request.RegisterRequest;
import com.trinhminhvi.techshop.auth.dto.response.LoginResponse;
import com.trinhminhvi.techshop.auth.dto.response.RegisterResponse;

public interface AuthService {
     public RegisterResponse register(RegisterRequest request);
     public LoginResponse login(LoginRequest request);
     public void logout(String token);
     public boolean introspectToken(String token);
}