package com.trinhminhvi.techshop.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.trinhminhvi.techshop.user.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User,String>{
    Optional<User> findByEmail(String email);
    Optional<User> findByPhone(String phone);
    Optional<User> findByUserName(String name);
}
