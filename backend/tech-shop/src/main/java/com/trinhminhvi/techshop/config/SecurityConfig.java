package com.trinhminhvi.techshop.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;
import com.trinhminhvi.techshop.security.JwtAuthenticationFilter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private static final String[] PUBLIC_ENDPOINTS = {
            "/auth/**",
            "/banners/**",
            "/products",
            "/products/**",

            "/images/**",
            "/brands/**",
            "/categories/**",
            "/review/**",

    };

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Value("${jwt.secret}")
    private String secretKey;

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .authorizeHttpRequests(auth -> auth

                        // Public
                        .requestMatchers(PUBLIC_ENDPOINTS).permitAll()

                        // Admin
                        .requestMatchers("/admin/**").hasRole("ADMIN")

                        // User hoặc Admin
                        .requestMatchers(
                                "/users/**",
                                "/addresses/**",
                                "/cart/**",
                                "/orders/**",
                                "/wishlist/**")
                        .hasAnyRole("USER", "ADMIN")

                        // Các endpoint còn lại
                        .anyRequest().authenticated());

        httpSecurity.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // httpSecurity.oauth2ResourceServer(oauth2 -> oauth2.jwt(jwtConfigurer ->
        // jwtConfigurer.decoder(jwtDecoder())));

        httpSecurity.csrf(AbstractHttpConfigurer -> AbstractHttpConfigurer.disable());
        

        httpSecurity.addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class);

        return httpSecurity.build();
    }

    // @Bean
    // JwtDecoder jwtDecoder(){
    // SecretKeySpec secretKeySpec = new
    // SecretKeySpec(secretKey.getBytes(),"HS256");
    // return NimbusJwtDecoder
    // .withSecretKey(secretKeySpec)
    // .macAlgorithm(MacAlgorithm.HS256)
    // .build();
    // }

}
