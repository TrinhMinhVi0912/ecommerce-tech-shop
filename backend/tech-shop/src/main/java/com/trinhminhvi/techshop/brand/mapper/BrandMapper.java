package com.trinhminhvi.techshop.brand.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.trinhminhvi.techshop.brand.dto.request.CreateBrandRequest;
import com.trinhminhvi.techshop.brand.dto.request.UpdateBrandRequest;
import com.trinhminhvi.techshop.brand.dto.response.BrandResponse;
import com.trinhminhvi.techshop.brand.entity.Brand;

@Mapper(componentModel = "spring")
public interface BrandMapper {
    BrandResponse toBrandResponse(Brand brand);

    @Mapping(target = "brandId", ignore = true)
    Brand toBrand(CreateBrandRequest request);

    @Mapping(target = "brandId", ignore = true)
    void updateBrandFromRequest(UpdateBrandRequest request, @MappingTarget Brand brand);
}
