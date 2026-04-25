package com.trinhminhvi.techshop.security;

import java.security.Key;
import java.util.Date;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.trinhminhvi.techshop.entity.User;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
    @Value("${jwt.secret}")
    private String SECRET;

    @Value("${jwt.expiration}")
    private int expiration;

    // chuyển SECRET sang chuỗi nhị phân và tạo key bằng chuỗi đó vì các thuật toán
    // không làm việc với kiểu chuỗi
    private Key getSignKey(){
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role",user.getRole().getName())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration)) // 1h
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .setId(UUID.randomUUID().toString())
                .compact();
    }

}
