package com.trinhminhvi.techshop.mapper;

import org.mapstruct.Mapper;

import com.trinhminhvi.techshop.dto.response.ProductImageResponse;
import com.trinhminhvi.techshop.entity.ProductImage;

@Mapper(componentModel = "spring")
public interface ProductImageMapper {
    ProductImageResponse toProductImageResponse(ProductImage productImage);
}