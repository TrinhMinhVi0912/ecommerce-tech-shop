package com.trinhminhvi.techshop.brand.service;

import java.util.List;
import org.springframework.data.domain.Pageable;

import com.trinhminhvi.techshop.banner.dto.response.BannerResponse;
import com.trinhminhvi.techshop.brand.dto.request.CreateBrandRequest;
import com.trinhminhvi.techshop.brand.dto.request.GetBrandsRequest;
import com.trinhminhvi.techshop.brand.dto.request.UpdateBrandRequest;
import com.trinhminhvi.techshop.brand.dto.response.BrandResponse;
import com.trinhminhvi.techshop.common.PageableResponse;

public interface BrandService {

    PageableResponse<List<BrandResponse>> getAllBrands(Pageable pageable, GetBrandsRequest getBrandsRequest);

    BrandResponse getBrandById(Integer id);

    BrandResponse createBrand(CreateBrandRequest request);

    BrandResponse updateBrand(Integer id, UpdateBrandRequest request);

    void deleteBrand(Integer id);

}
