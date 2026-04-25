package com.trinhminhvi.techshop.service.impl;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.trinhminhvi.techshop.dto.request.LoginRequest;
import com.trinhminhvi.techshop.dto.request.RegisterRequest;
import com.trinhminhvi.techshop.dto.response.LoginResponse;
import com.trinhminhvi.techshop.dto.response.RegisterResponse;
import com.trinhminhvi.techshop.entity.Role;
import com.trinhminhvi.techshop.entity.User;
import com.trinhminhvi.techshop.mapper.UserMapper;
import com.trinhminhvi.techshop.repository.RoleRepository;
import com.trinhminhvi.techshop.repository.UserRepository;
import com.trinhminhvi.techshop.security.JwtService;
import com.trinhminhvi.techshop.service.AuthService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor // tao constructor cac tham so de spring tim bean vao
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public RegisterResponse register(RegisterRequest request) {
        // Check email
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exist");
        }
        // Check phone
        if (userRepository.findByPhone(request.getPhone()).isPresent()) {
            throw new RuntimeException("Phone number already exist");
        }
        // map từ request sang user
        User user = userMapper.toUser(request);

        user.setCreatedAt(LocalDateTime.now());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        Role role = roleRepository.findByName("USER").orElseThrow(
                () -> new RuntimeException("Role not Found"));

        user.setRole(role);
        userRepository.save(user);

        return userMapper.toRegisterResponse(user);

    }

    @Override
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        String token = jwtService.generateToken(user);
        return LoginResponse
                .builder()
                    .email(user.getEmail())
                    .role(user.getRole().getName())
                    .token(token)
                .build();
    }
    
}
