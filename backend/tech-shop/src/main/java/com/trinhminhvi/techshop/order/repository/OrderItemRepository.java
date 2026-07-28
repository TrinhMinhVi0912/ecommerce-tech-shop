package com.trinhminhvi.techshop.order.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.trinhminhvi.techshop.order.entity.OrderItem;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {

    @Query(value = """
            SELECT
                p.product_id,
                p.name,
                pi.image_path,
                b.name,
                c.name,
                SUM(oi.quantity) AS total_sold,
                SUM(oi.price * oi.quantity) AS revenue
            FROM order_items oi

            JOIN orders o
                ON oi.order_id = o.order_id

            JOIN product_variants pv
                ON oi.variant_id = pv.variant_id

            JOIN products p
                ON pv.product_id = p.product_id

            JOIN brand b
                ON p.brand_id = b.brand_id

            JOIN categories c
                ON p.category_id = c.category_id

            LEFT JOIN product_img pi
                ON pi.product_id = p.product_id
                AND pi.is_thumbnail = true

            WHERE

                o.status = 'COMPLETED'

            AND

                o.created_at BETWEEN :startDate AND :endDate

            GROUP BY
                p.product_id,
                p.name,
                pi.image_path,
                b.name,
                c.name

            ORDER BY
                total_sold DESC,
                revenue DESC

            LIMIT 10
            """, nativeQuery = true)
    List<Object[]> findTopSellingProducts(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

}
