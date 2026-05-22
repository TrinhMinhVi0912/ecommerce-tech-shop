package com.trinhminhvi.techshop.mapper;

import org.mapstruct.Mapper;

import com.trinhminhvi.techshop.dto.response.ProductVariantResponse;
import com.trinhminhvi.techshop.entity.ProductVariant;

@Mapper(componentModel = "spring")
public interface ProductVariantMapper {
    ProductVariantResponse toProductVariantResponse(ProductVariant productVariant);
}