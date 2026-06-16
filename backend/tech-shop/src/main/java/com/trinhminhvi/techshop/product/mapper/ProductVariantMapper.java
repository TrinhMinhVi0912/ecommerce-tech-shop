package com.trinhminhvi.techshop.product.mapper;

import org.mapstruct.Mapper;

import com.trinhminhvi.techshop.product.dto.response.ProductVariantResponse;
import com.trinhminhvi.techshop.product.entity.ProductVariant;

@Mapper(componentModel = "spring")
public interface ProductVariantMapper {
    ProductVariantResponse toProductVariantResponse(ProductVariant productVariant);
}