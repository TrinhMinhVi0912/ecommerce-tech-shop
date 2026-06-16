package com.trinhminhvi.techshop.product.mapper;

import java.lang.annotation.Target;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.trinhminhvi.techshop.product.dto.response.ProductResponse;
import com.trinhminhvi.techshop.product.entity.Product;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    ProductResponse toProductResponse(Product product);
}
