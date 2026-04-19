package com.trinhminhvi.techshop.service;

import com.trinhminhvi.techshop.dto.request.RegisterRequest;
import com.trinhminhvi.techshop.dto.response.RegisterResponse;

public interface AuthService {
     public RegisterResponse register(RegisterRequest request);
}