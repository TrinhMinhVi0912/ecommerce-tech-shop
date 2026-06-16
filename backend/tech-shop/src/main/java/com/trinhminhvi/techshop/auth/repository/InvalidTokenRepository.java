package com.trinhminhvi.techshop.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.trinhminhvi.techshop.auth.entity.InvalidToken;

@Repository
public interface InvalidTokenRepository extends JpaRepository<InvalidToken,Integer>{
    boolean existsByToken(String token);
}
