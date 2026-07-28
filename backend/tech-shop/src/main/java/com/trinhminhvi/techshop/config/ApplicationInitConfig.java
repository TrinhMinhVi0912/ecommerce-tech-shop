package com.trinhminhvi.techshop.config;

import java.time.LocalDateTime;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.trinhminhvi.techshop.user.entity.Role;
import com.trinhminhvi.techshop.user.entity.User;
import com.trinhminhvi.techshop.user.repository.RoleRepository;
import com.trinhminhvi.techshop.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class ApplicationInitConfig {

    private final PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner applicationRunner(
            UserRepository userRepository,
            RoleRepository roleRepository) {

        return args -> {

            Role adminRole = roleRepository.findByName("ADMIN")
                    .orElseGet(() -> roleRepository.save(
                            Role.builder()
                                    .name("ADMIN")
                                    .build()));

            roleRepository.findByName("USER")
                    .orElseGet(() -> roleRepository.save(
                            Role.builder()
                                    .name("USER")
                                    .build()));

            if (userRepository.findByEmail("admin@techshop.com").isEmpty()) {

                User admin = User.builder()
                        .email("admin@techshop.com")
                        .userName("admin")
                        .password(passwordEncoder.encode("Admin@123"))
                        .fullName("System Administrator")
                        .phone("0123456789")
                        .avatarPath("/images/default.jpg")
                        .createdAt(LocalDateTime.now())
                        .enabled(true)
                        .role(adminRole)
                        .build();

                userRepository.save(admin);

                System.out.println("===== ADMIN ACCOUNT CREATED =====");
                System.out.println("Username : admin");
                System.out.println("Password : Admin@123");
            }
        };
    }
}
