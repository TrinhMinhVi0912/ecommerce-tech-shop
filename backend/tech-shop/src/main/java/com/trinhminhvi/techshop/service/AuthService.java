package com.trinhminhvi.techshop.service;

import com.trinhminhvi.techshop.dto.request.LoginRequest;
import com.trinhminhvi.techshop.dto.request.RegisterRequest;
import com.trinhminhvi.techshop.dto.response.LoginResponse;
import com.trinhminhvi.techshop.dto.response.RegisterResponse;

public interface AuthService {
     public RegisterResponse register(RegisterRequest request);
     public LoginResponse login(LoginRequest request);
     public void logout(String token);
     public boolean introspectToken(String token);
}