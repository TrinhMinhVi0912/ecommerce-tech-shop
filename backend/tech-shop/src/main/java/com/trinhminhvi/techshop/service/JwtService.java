package com.trinhminhvi.techshop.service;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

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

    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration)) // 1h
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

}
