package com.trinhminhvi.techshop.category.controller;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trinhminhvi.techshop.category.dto.request.CreateCategoryRequest;
import com.trinhminhvi.techshop.category.dto.request.GetCategoriesRequest;
import com.trinhminhvi.techshop.category.dto.request.UpdateCategoryRequest;
import com.trinhminhvi.techshop.category.dto.response.CategoryResponse;
import com.trinhminhvi.techshop.category.service.CategoryService;
import com.trinhminhvi.techshop.common.ApiResponse;
import com.trinhminhvi.techshop.common.PageableResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/categories")
@CrossOrigin("*")
@RequiredArgsConstructor
public class CategoryAdminController {

    private final CategoryService categoryService;

    @PostMapping
    public ApiResponse<CategoryResponse> createCategory(@RequestBody @Validated CreateCategoryRequest request) {
        return ApiResponse.<CategoryResponse>builder()
                .success(true)
                .message("Create Category Successfully")
                .data(categoryService.createCategory(request))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<CategoryResponse> updateCategory(
            @PathVariable Integer id,
            @RequestBody @Validated UpdateCategoryRequest request) {
        return ApiResponse.<CategoryResponse>builder()
                .success(true)
                .message("Update Category Successfully")
                .data(categoryService.updateCategory(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Object> deleteCategory(@PathVariable Integer id) {
        categoryService.deleteCategory(id);
        return ApiResponse.builder()
                .success(true)
                .message("Delete Category Successfully")
                .data(null)
                .build();
    }
}
