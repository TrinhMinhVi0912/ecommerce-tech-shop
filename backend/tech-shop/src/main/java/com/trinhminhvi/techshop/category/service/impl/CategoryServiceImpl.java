package com.trinhminhvi.techshop.category.service.impl;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trinhminhvi.techshop.category.dto.request.CreateCategoryRequest;
import com.trinhminhvi.techshop.category.dto.request.GetCategoriesRequest;
import com.trinhminhvi.techshop.category.dto.request.UpdateCategoryRequest;
import com.trinhminhvi.techshop.category.dto.response.CategoryResponse;
import com.trinhminhvi.techshop.category.entity.Category;
import com.trinhminhvi.techshop.category.mapper.CategoryMapper;
import com.trinhminhvi.techshop.category.repository.CategoryRepository;
import com.trinhminhvi.techshop.category.service.CategoryService;
import com.trinhminhvi.techshop.common.PageableResponse;
import com.trinhminhvi.techshop.product.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CategoryMapper categoryMapper;

    @Override
    @Transactional(readOnly = true)
    public PageableResponse<List<CategoryResponse>> getAllCategories(Pageable pageable, GetCategoriesRequest getCategoriesRequest) {
        Page<Category> pageCategories = categoryRepository.searchCategories(
                getCategoriesRequest.getSearch(),
                getCategoriesRequest.getParentId(),
                pageable);

        List<CategoryResponse> listCategoryResponses = pageCategories.getContent().stream()
                .map(categoryMapper::toCategoryResponse)
                .toList();

        return PageableResponse.<List<CategoryResponse>>builder()
                .pageNum(getCategoriesRequest.getPageNum())
                .pageSize(getCategoriesRequest.getPageSize())
                .totalElements(pageCategories.getTotalElements())
                .totalPages(pageCategories.getTotalPages())
                .items(listCategoryResponses)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found."));

        return categoryMapper.toCategoryResponse(category);
    }

    @Override
    @Transactional
    public CategoryResponse createCategory(CreateCategoryRequest request) {
        String trimmedName = request.getName() != null ? request.getName().trim() : "";

        if (categoryRepository.existsByNameIgnoreCaseTrim(trimmedName)) {
            throw new RuntimeException("Category name already exists.");
        }

        Category category = categoryMapper.toCategory(request);
        category.setName(trimmedName);

        if (request.getParentId() != null) {
            Category parentCategory = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent category not found."));
            category.setCategory(parentCategory);
        }

        Category savedCategory = categoryRepository.save(category);
        return categoryMapper.toCategoryResponse(savedCategory);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(Integer id, UpdateCategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found."));

        String trimmedName = request.getName() != null ? request.getName().trim() : "";

        if (categoryRepository.existsByNameIgnoreCaseTrimAndCategoryIdNot(trimmedName, id)) {
            throw new RuntimeException("Category name already exists.");
        }

        if (request.getParentId() != null) {
            if (request.getParentId().equals(id)) {
                throw new RuntimeException("Category cannot be its own parent.");
            }
            Category parentCategory = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent category not found."));

            // Check if parentCategory is a descendant of current category
            Category curr = parentCategory;
            while (curr != null) {
                if (curr.getCategoryId().equals(id)) {
                    throw new RuntimeException("Category cannot be a child of its own subcategory.");
                }
                curr = curr.getCategory();
            }

            category.setCategory(parentCategory);
        } else {
            category.setCategory(null);
        }

        categoryMapper.updateCategoryFromRequest(request, category);
        category.setName(trimmedName);

        Category updatedCategory = categoryRepository.save(category);
        return categoryMapper.toCategoryResponse(updatedCategory);
    }

    @Override
    @Transactional
    public void deleteCategory(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found."));

        if (categoryRepository.existsByCategoryCategoryId(id)) {
            throw new RuntimeException("Category has child categories. Cannot delete.");
        }

        if (productRepository.existsByCategoryCategoryId(id)) {
            throw new RuntimeException("Category contains products. Cannot delete.");
        }

        categoryRepository.delete(category);
    }
}
