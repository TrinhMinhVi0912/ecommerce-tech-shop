package com.trinhminhvi.techshop.brand.mapper;

import org.mapstruct.Mapper;

import com.trinhminhvi.techshop.brand.dto.response.BrandResponse;
import com.trinhminhvi.techshop.brand.entity.Brand;


@Mapper(componentModel = "spring")
public interface BrandMapper {
    BrandResponse toBrandResponse(Brand brand);
}
