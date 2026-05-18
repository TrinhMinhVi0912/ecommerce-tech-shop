package com.trinhminhvi.techshop.mapper;

import org.mapstruct.Mapper;

import com.trinhminhvi.techshop.dto.response.BrandResponse;
import com.trinhminhvi.techshop.entity.Brand;


@Mapper(componentModel = "spring")
public interface BrandMapper {
    BrandResponse toBrandResponse(Brand brand);
}
