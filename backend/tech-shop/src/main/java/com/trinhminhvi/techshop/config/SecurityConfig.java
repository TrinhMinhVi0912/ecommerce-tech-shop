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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private static final String[] PUBLIC_ENDPOINTS = {
            "/auth/**",
            "/banners/**",
            "/banners",
            "/products",
            "/products/**",
            "/images/**",
            "/brands/**",
            "/categories/**",
            "/products/*/*",
            "/payment/vnpay/return"
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
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                
                // CSRF
                .csrf(csrf -> csrf.disable())
                
                // Session
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                
                // Authorize
                .authorizeHttpRequests(auth -> auth
                        // Public
                        .requestMatchers(PUBLIC_ENDPOINTS).permitAll()
                        
                        // OPTIONS requests - cho phép tất cả (CORS preflight)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

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

        // Add JWT filter
        httpSecurity.addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class);

        return httpSecurity.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Cho phép frontend
        configuration.addAllowedOrigin("http://localhost:5173");
        configuration.addAllowedOrigin("http://localhost:3000"); // Nếu dùng port khác
        
        // Cho phép tất cả methods
        configuration.addAllowedMethod("*");
        
        // Cho phép tất cả headers
        configuration.addAllowedHeader("*");
        
        // Cho phép gửi credentials (cookie, authorization header)
        configuration.setAllowCredentials(true);
        
        // Cache preflight request trong 1 giờ
        configuration.setMaxAge(3600L);
        
        // Áp dụng cho tất cả endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }

    // @Bean
    // JwtDecoder jwtDecoder(){
    //     SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(), "HS256");
    //     return NimbusJwtDecoder
    //             .withSecretKey(secretKeySpec)
    //             .macAlgorithm(MacAlgorithm.HS256)
    //             .build();
    // }
}