package com.trinhminhvi.techshop.mapper;

import org.mapstruct.Mapper;

import com.trinhminhvi.techshop.dto.response.ProductResponse;
import com.trinhminhvi.techshop.entity.Product;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    ProductResponse toProductResponse(Product product);
}
