package com.trinhminhvi.techshop.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trinhminhvi.techshop.dto.request.RegisterRequest;
import com.trinhminhvi.techshop.dto.response.ApiResponse;
import com.trinhminhvi.techshop.dto.response.RegisterResponse;
import com.trinhminhvi.techshop.service.AuthService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegisterResponse>> register(@RequestBody RegisterRequest request){
        return ResponseEntity.ok(ApiResponse.<RegisterResponse>
            builder()
            .success(true)
            .message("Register Successfully")
            .data(authService.register(request))
            .build()
        );
    }

}
