package com.trinhminhvi.techshop.product.mapper;

import java.lang.annotation.Target;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.trinhminhvi.techshop.product.dto.request.CreateProductRequest;
import com.trinhminhvi.techshop.product.dto.request.UpdateProductRequest;
import com.trinhminhvi.techshop.product.dto.response.ProductForAdminResponse;
import com.trinhminhvi.techshop.product.dto.response.ProductResponse;
import com.trinhminhvi.techshop.product.entity.Product;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    ProductResponse toProductResponse(Product product);

    ProductForAdminResponse toProductForAdminResponse(Product product);

    @Mapping(target = "productId", ignore = true)
    @Mapping(target = "brand", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "productImages", ignore = true)
    Product toProduct(CreateProductRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "productId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "brand", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "productImages", ignore = true)
    void updateProductFromRequest(UpdateProductRequest request, @MappingTarget Product product);

}
