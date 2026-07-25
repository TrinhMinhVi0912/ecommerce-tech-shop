package com.trinhminhvi.techshop.wishlist.entity;

import com.trinhminhvi.techshop.product.entity.Product;
import com.trinhminhvi.techshop.user.entity.User;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "wishlist")
public class Wishlist {

    @EmbeddedId
    private WishlistId id;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id",columnDefinition = "CHAR(36)")
    private User user;

    @ManyToOne
    @MapsId("productId")
    @JoinColumn(name = "product_id")
    private Product product;

}