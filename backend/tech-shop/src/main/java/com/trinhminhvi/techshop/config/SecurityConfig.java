package com.trinhminhvi.techshop.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    private final String[] PUBLIC_ENDPOINTS = {
            "/auth/login", "/auth/register", "/auth/logout", "/auth/introspect",
            "/products", "/products/*", "/products/*/*",
            "/images/products/*",
            "/review/*/*"
    };
    @Value("${jwt.secret}")
    private String secretKey;


    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .authorizeHttpRequests(request -> request.requestMatchers(HttpMethod.POST, PUBLIC_ENDPOINTS).permitAll()
                        .requestMatchers(HttpMethod.GET, PUBLIC_ENDPOINTS).permitAll()
                        .requestMatchers(HttpMethod.PUT,PUBLIC_ENDPOINTS).permitAll()
                        .requestMatchers(HttpMethod.DELETE,PUBLIC_ENDPOINTS).permitAll()
                        .requestMatchers(HttpMethod.POST,PUBLIC_ENDPOINTS).permitAll()
                        .anyRequest().authenticated());

        // httpSecurity.oauth2ResourceServer(oauth2 -> oauth2.jwt(jwtConfigurer ->
        // jwtConfigurer.decoder(jwtDecoder())));

        httpSecurity.csrf(AbstractHttpConfigurer -> AbstractHttpConfigurer.disable());

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
