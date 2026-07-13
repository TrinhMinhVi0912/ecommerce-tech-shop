package com.trinhminhvi.techshop.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.trinhminhvi.techshop.user.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);

    Optional<User> findByPhone(String phone);

    Optional<User> findByUserName(String name);


    // DTO có thể phát sinh LazyInitializationException nếu truy cập ngoài transaction.
    @Query("""
                SELECT u
                FROM User u
                LEFT JOIN FETCH u.addresses
                WHERE u.userId = :userId
            """)
    Optional<User> findByIdWithAddresses(String userId);

}
