package com.trinhminhvi.techshop.wishlist.repository;

import com.trinhminhvi.techshop.product.entity.Product;
import com.trinhminhvi.techshop.user.entity.User;
import com.trinhminhvi.techshop.wishlist.entity.Wishlist;
import com.trinhminhvi.techshop.wishlist.entity.WishlistId;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, WishlistId> {

    boolean existsByUserAndProduct(
            User user,
            Product product);

    void deleteByUserAndProduct(
            User user,
            Product product);

    @EntityGraph(attributePaths = {
            "product",
            "product.productImages"
    })
    Page<Wishlist> findByUser(
            User user,
            Pageable pageable);
}
