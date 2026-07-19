package com.trinhminhvi.techshop.user.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.trinhminhvi.techshop.user.entity.Address;
import com.trinhminhvi.techshop.user.entity.User;

@Repository
public interface AddressRepository extends JpaRepository<Address, Integer> {
    List<Address> findByUser(User user);

    boolean existsByUser(User user);

    @Modifying
    @Query("""
                UPDATE Address a
                SET a.defaultAddress = false
                WHERE a.user = :user
            """)
    int clearDefaultAddress(@Param("user") User user);

    Optional<Address> findByAddressIdAndUser(Integer addressId, User user);

    Optional<Address> findFirstByUserAndAddressIdNotOrderByAddressIdAsc(User user, Integer addressId);


}
