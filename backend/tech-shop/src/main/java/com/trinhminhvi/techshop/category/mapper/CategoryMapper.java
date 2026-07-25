package com.trinhminhvi.techshop.category.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.trinhminhvi.techshop.category.dto.request.CreateCategoryRequest;
import com.trinhminhvi.techshop.category.dto.request.UpdateCategoryRequest;
import com.trinhminhvi.techshop.category.dto.response.CategoryResponse;
import com.trinhminhvi.techshop.category.entity.Category;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    @Mapping(source = "category.categoryId", target = "parentId")
    @Mapping(source = "category.name", target = "parentName")
    CategoryResponse toCategoryResponse(Category category);

    @Mapping(target = "categoryId", ignore = true)
    @Mapping(target = "category", ignore = true)
    Category toCategory(CreateCategoryRequest request);

    @Mapping(target = "categoryId", ignore = true)
    @Mapping(target = "category", ignore = true)
    void updateCategoryFromRequest(UpdateCategoryRequest request, @MappingTarget Category category);
}
