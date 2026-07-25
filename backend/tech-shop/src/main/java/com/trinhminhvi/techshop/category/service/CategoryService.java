package com.trinhminhvi.techshop.category.service;

import java.util.List;
import org.springframework.data.domain.Pageable;

import com.trinhminhvi.techshop.category.dto.request.CreateCategoryRequest;
import com.trinhminhvi.techshop.category.dto.request.GetCategoriesRequest;
import com.trinhminhvi.techshop.category.dto.request.UpdateCategoryRequest;
import com.trinhminhvi.techshop.category.dto.response.CategoryResponse;
import com.trinhminhvi.techshop.common.PageableResponse;

public interface CategoryService {

    PageableResponse<List<CategoryResponse>> getAllCategories(Pageable pageable, GetCategoriesRequest getCategoriesRequest);

    CategoryResponse getCategoryById(Integer id);

    CategoryResponse createCategory(CreateCategoryRequest request);

    CategoryResponse updateCategory(Integer id, UpdateCategoryRequest request);

    void deleteCategory(Integer id);
}
