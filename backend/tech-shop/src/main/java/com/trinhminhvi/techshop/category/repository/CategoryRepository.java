package com.trinhminhvi.techshop.category.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.trinhminhvi.techshop.category.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {

        @Query(value = """
                        WITH RECURSIVE category_tree AS (
                            SELECT category_id
                            FROM categories
                            WHERE category_id = :categoryId
                            UNION ALL
                            SELECT c.category_id
                            FROM categories c
                            INNER JOIN category_tree ct ON c.parent_id = ct.category_id
                        )
                        SELECT category_id FROM category_tree
                        """, nativeQuery = true)
        List<Integer> findAllCategoryIdsByParentId(@Param("categoryId") Integer categoryId);

        @Query(value = """
                        WITH RECURSIVE category_tree AS (
                            SELECT category_id
                            FROM categories
                            WHERE category_id = :categoryId
                            UNION ALL
                            SELECT c.category_id
                            FROM categories c
                            INNER JOIN category_tree ct ON c.parent_id = ct.category_id
                        )
                        SELECT category_id FROM category_tree WHERE category_id != :categoryId
                        """, nativeQuery = true)
        List<Integer> findChildrenCategoryIds(@Param("categoryId") Integer categoryId);

        @Query("""
                        SELECT c
                        FROM Category c
                        WHERE (:search IS NULL OR LOWER(TRIM(c.name)) LIKE LOWER(CONCAT('%', TRIM(:search), '%')))
                          AND (:parentId IS NULL OR c.category.categoryId = :parentId)
                        """)
        Page<Category> searchCategories(
                        @Param("search") String search,
                        @Param("parentId") Integer parentId,
                        Pageable pageable);

        @Query("SELECT COUNT(c) > 0 FROM Category c WHERE LOWER(TRIM(c.name)) = LOWER(TRIM(:name))")
        boolean existsByNameIgnoreCaseTrim(@Param("name") String name);

        @Query("SELECT COUNT(c) > 0 FROM Category c WHERE LOWER(TRIM(c.name)) = LOWER(TRIM(:name)) AND c.categoryId != :categoryId")
        boolean existsByNameIgnoreCaseTrimAndCategoryIdNot(@Param("name") String name,
                        @Param("categoryId") Integer categoryId);

        boolean existsByCategoryCategoryId(Integer categoryId);
}