package com.trinhminhvi.techshop.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.trinhminhvi.techshop.entity.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {


    @Query("""
                SELECT r
                FROM Review r
                WHERE r.product.productId = :productId
                ORDER BY r.createdAt DESC
            """)
    Page<Review> findAllByProduct(
            Pageable pageable,
            @Param("productId") Integer productId);




    // sẽ ra 2 cột 
    // cột đầu là AVG -> trung bình rating
    // cột hai là Count -> số lượng review của proudctId đó
    @Query("""
                SELECT
                    AVG(r.rating),
                    COUNT(r)
                FROM Review r
                WHERE r.product.productId = :productId
            """)
    Object getReviewSummary(
            @Param("productId") Integer productId
    );



    // Tìm kiếm số lượng của mỗi rating
    // VD 5sao -> 100
    //    4sao -> 20 ....
    @Query("""
                SELECT
                    r.rating,
                    COUNT(r)
                FROM Review r
                WHERE r.product.productId = :productId
                GROUP BY r.rating
            """)
    List<Object[]> countRatingBreakdown(
            @Param("productId") Integer productId);
}