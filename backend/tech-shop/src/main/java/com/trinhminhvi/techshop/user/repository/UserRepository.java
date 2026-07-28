package com.trinhminhvi.techshop.user.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.trinhminhvi.techshop.user.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);

    Optional<User> findByPhone(String phone);

    Optional<User> findByUserName(String name);

    // DTO có thể phát sinh LazyInitializationException nếu truy cập ngoài
    // transaction.
    @Query("""
                SELECT u
                FROM User u
                LEFT JOIN FETCH u.addresses
                WHERE u.userId = :userId
            """)
    Optional<User> findByIdWithAddresses(String userId);

    @Query("""
            SELECT u
            FROM User u
            WHERE
                LOWER(u.role.name) <> 'admin'

            AND
            (
                :search IS NULL
                OR LOWER(u.userName) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(u.phone) LIKE LOWER(CONCAT('%', :search, '%'))
            )
            """)
    Page<User> searchUsers(
            @Param("search") String search,
            Pageable pageable);

    long countByEnabledTrue();

}
