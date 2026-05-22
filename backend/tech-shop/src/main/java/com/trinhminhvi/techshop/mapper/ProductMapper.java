package com.trinhminhvi.techshop.mapper;

import java.lang.annotation.Target;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.trinhminhvi.techshop.dto.response.ProductResponse;
import com.trinhminhvi.techshop.entity.Product;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    ProductResponse toProductResponse(Product product);
}
