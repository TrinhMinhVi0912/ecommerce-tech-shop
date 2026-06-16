package com.trinhminhvi.techshop.security;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.trinhminhvi.techshop.user.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;

@Service
public class JwtService {
    @Value("${jwt.secret}")
    private String SECRET;

    @Value("${jwt.expiration}")
    private int expiration;

    // chuyển SECRET sang chuỗi nhị phân và tạo key bằng chuỗi đó vì các thuật toán
    // không làm việc với kiểu chuỗi
    private Key getSignKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getUserId())
                .claim("role", user.getRole().getName())
                .claim("email", user.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration)) // 1h
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .setId(UUID.randomUUID().toString())
                .compact();
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public Date getExpiration(String token) {
        return extractAllClaims(token).getExpiration();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSignKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            throw new RuntimeException("Token expired");

        } catch (UnsupportedJwtException e) {
            throw new RuntimeException("Unsupported token");

        } catch (MalformedJwtException e) {
            throw new RuntimeException("Malformed token");
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Token is empty");
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Validated Token Fail");
        }
    }

    public String extractToken(
            HttpServletRequest httpServletRequest) {
        String authHeader = httpServletRequest.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Token is missing");
        }

        return authHeader.substring(7);

    }


    public String extractEmailFromToken(String token){
        return extractAllClaims(token).get("email",String.class);
    }

    public String extractUserIdFromToken(String token){
        return extractAllClaims(token).getSubject();
    }

}
