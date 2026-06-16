package com.trinhminhvi.techshop.product.mapper;

import org.mapstruct.Mapper;

import com.trinhminhvi.techshop.product.dto.response.ProductImageResponse;
import com.trinhminhvi.techshop.product.entity.ProductImage;

@Mapper(componentModel = "spring")
public interface ProductImageMapper {
    ProductImageResponse toProductImageResponse(ProductImage productImage);
}