package com.trinhminhvi.techshop.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        
        // Cho phép frontend
        config.addAllowedOrigin("http://localhost:5173");
        
        // Cho phép các method
        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("DELETE");
        config.addAllowedMethod("PATCH");
        config.addAllowedMethod("OPTIONS");
        
        // Cho phép các header
        config.addAllowedHeader("*");
        
        // Cho phép gửi cookie/credentials
        config.setAllowCredentials(true);
        
        // Cache preflight request trong 1 giờ
        config.setMaxAge(3600L);
        
        // Áp dụng cho tất cả API
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        source.registerCorsConfiguration("/auth/**", config);
        
        return new CorsFilter(source);
    }
}