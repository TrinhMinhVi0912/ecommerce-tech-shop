package com.trinhminhvi.techshop.category.mapper;

import org.mapstruct.Mapper;

import com.trinhminhvi.techshop.category.dto.response.CategoryResponse;
import com.trinhminhvi.techshop.category.entity.Category;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryResponse toCategoryResponse(Category category);
}
