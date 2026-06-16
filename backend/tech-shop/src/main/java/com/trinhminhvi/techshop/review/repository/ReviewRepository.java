package com.trinhminhvi.techshop.review.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.trinhminhvi.techshop.product.entity.Product;
import com.trinhminhvi.techshop.review.entity.Review;
import com.trinhminhvi.techshop.user.entity.User;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {

    // đưa người dùng hiên tại lên đầu danh sách nếu khách chưa đăng nhập hay khách vãng lai thì được gán giá trị 1 nên không thay đổi
    @Query("""
                SELECT r
                FROM Review r
                WHERE r.product.productId = :productId
                ORDER BY
                    CASE WHEN (:userId IS NOT NULL AND r.user.userId = :userId) THEN 0 ELSE 1 END ASC,
                    r.createdAt DESC
            """)
    Page<Review> findAllByProduct(
            Pageable pageable,
            @Param("productId") Integer productId,
            @Param("userId") String userId);

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
            @Param("productId") Integer productId);


            
    // Tìm kiếm số lượng của mỗi rating
    // VD 5sao -> 100
    // 4sao -> 20 ....
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

    Optional<Review> findByUserUserIdAndProductProductId(String userId, Integer productId);

    boolean existsByUserAndProduct(User user, Product product);

    void deleteByUserUserIdAndProductProductId(String userId, Integer productId);

}