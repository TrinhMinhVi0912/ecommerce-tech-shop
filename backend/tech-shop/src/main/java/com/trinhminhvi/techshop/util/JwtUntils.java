package com.trinhminhvi.techshop.util;

import jakarta.servlet.http.HttpServletRequest;

public final class JwtUntils {


    public static String extractToken(
        HttpServletRequest httpServletRequest
    ){
        String authHeader = httpServletRequest.getHeader("Authorization");

        if(authHeader == null || !authHeader.startsWith("Bearer ")){
            throw new RuntimeException("Token is missing");
        }

        return authHeader.substring(7);

    }

}
