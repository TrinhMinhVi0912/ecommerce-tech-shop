package com.trinhminhvi.techshop.service.impl;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.trinhminhvi.techshop.dto.request.LoginRequest;
import com.trinhminhvi.techshop.dto.request.RegisterRequest;
import com.trinhminhvi.techshop.dto.response.LoginResponse;
import com.trinhminhvi.techshop.dto.response.RegisterResponse;
import com.trinhminhvi.techshop.entity.InvalidToken;
import com.trinhminhvi.techshop.entity.Role;
import com.trinhminhvi.techshop.entity.User;
import com.trinhminhvi.techshop.mapper.UserMapper;
import com.trinhminhvi.techshop.repository.InvalidTokenRepository;
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
    private final InvalidTokenRepository invalidTokenRepository;

    private final UserMapper userMapper;

    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public RegisterResponse register(RegisterRequest request) {

        // Check User Name
        if (userRepository.findByUserName(request.getUserName()).isPresent()) {
            throw new RuntimeException("UserName already exist");
        }

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
        user.setAvatarPath("/images/default.jpg");
        userRepository.save(user);

        return userMapper.toRegisterResponse(user);

    }

    @Override
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUserName(request.getUserName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        String token = jwtService.generateToken(user);
        return LoginResponse
                .builder()
                .email(user.getEmail())
                .userName(user.getUserName())
                .role(user.getRole().getName())
                .token(token)
                .build();
    }

    @Override
    public void logout(String token) {

        // check token hop le
        // ham nay tra ve true no token hop le va ne co loi thi da throws day du
        jwtService.validateToken(token);

        // check blacklist
        if (invalidTokenRepository.existsByToken(token)) {
            throw new RuntimeException("Token already logged out");
        }

        Date expiration = jwtService.getExpiration(token);

        InvalidToken invalidToken = InvalidToken.builder()
                .token(token)
                .expiredAt(expiration.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime())
                .build();

        invalidTokenRepository.save(invalidToken);
    }

    @Override
    public boolean introspectToken(String token){
        return jwtService.validateToken(token);
    }

}
