package com.trinhminhvi.techshop.category.controller;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trinhminhvi.techshop.category.dto.request.GetCategoriesRequest;
import com.trinhminhvi.techshop.category.dto.response.CategoryResponse;
import com.trinhminhvi.techshop.category.service.CategoryService;
import com.trinhminhvi.techshop.common.ApiResponse;
import com.trinhminhvi.techshop.common.PageableResponse;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/categories")
@CrossOrigin("*")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping
    public ApiResponse<PageableResponse<List<CategoryResponse>>> getAllCategories(
            GetCategoriesRequest getCategoriesRequest) {
        Sort sort = getCategoriesRequest.getSortDir().equalsIgnoreCase("ASC")
                ? Sort.by(getCategoriesRequest.getSortBy()).ascending()
                : Sort.by(getCategoriesRequest.getSortBy()).descending();

        return ApiResponse.<PageableResponse<List<CategoryResponse>>>builder()
                .success(true)
                .message("Get Categories Successfully")
                .data(categoryService.getAllCategories(PageRequest.of(
                        getCategoriesRequest.getPageNum() - 1,
                        getCategoriesRequest.getPageSize(),
                        sort), getCategoriesRequest))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<CategoryResponse> getCategoryById(@PathVariable Integer id) {
        return ApiResponse.<CategoryResponse>builder()
                .success(true)
                .message("Get Detail Category Successfully")
                .data(categoryService.getCategoryById(id))
                .build();
    }
}
