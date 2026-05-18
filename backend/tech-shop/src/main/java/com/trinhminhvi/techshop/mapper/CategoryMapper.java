package com.trinhminhvi.techshop.mapper;

import org.mapstruct.Mapper;

import com.trinhminhvi.techshop.dto.response.CategoryResponse;
import com.trinhminhvi.techshop.entity.Category;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryResponse toCategoryResponse(Category category);
}
