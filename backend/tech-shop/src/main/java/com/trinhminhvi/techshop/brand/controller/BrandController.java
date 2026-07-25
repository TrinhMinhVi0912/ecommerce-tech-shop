package com.trinhminhvi.techshop.brand.controller;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trinhminhvi.techshop.brand.dto.request.CreateBrandRequest;
import com.trinhminhvi.techshop.brand.dto.request.GetBrandsRequest;
import com.trinhminhvi.techshop.brand.dto.request.UpdateBrandRequest;
import com.trinhminhvi.techshop.brand.dto.response.BrandResponse;
import com.trinhminhvi.techshop.brand.service.BrandService;
import com.trinhminhvi.techshop.common.ApiResponse;
import com.trinhminhvi.techshop.common.PageableResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/brands")
@CrossOrigin("*")
@RequiredArgsConstructor
public class BrandController {

    private final BrandService brandService;

    @GetMapping
    public ApiResponse<PageableResponse<List<BrandResponse>>> getAllBrands(@Validated GetBrandsRequest getBrandsRequest) {
        Sort sort = getBrandsRequest.getSortDir().equalsIgnoreCase("ASC")
                ? Sort.by(getBrandsRequest.getSortBy()).ascending()
                : Sort.by(getBrandsRequest.getSortBy()).descending();

        return ApiResponse.<PageableResponse<List<BrandResponse>>>builder()
                .success(true)
                .message("Get Brands Successfully")
                .data(brandService.getAllBrands(PageRequest.of(
                        getBrandsRequest.getPageNum() - 1,
                        getBrandsRequest.getPageSize(),
                        sort), getBrandsRequest))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<BrandResponse> getBrandById(@PathVariable Integer id) {
        return ApiResponse.<BrandResponse>builder()
                .success(true)
                .message("Get Detail Brand Successfully")
                .data(brandService.getBrandById(id))
                .build();
    }

    @PostMapping
    public ApiResponse<BrandResponse> createBrand(@RequestBody @Validated CreateBrandRequest request) {
        return ApiResponse.<BrandResponse>builder()
                .success(true)
                .message("Create Brand Successfully")
                .data(brandService.createBrand(request))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<BrandResponse> updateBrand(
            @PathVariable Integer id,
            @RequestBody @Validated UpdateBrandRequest request) {
        return ApiResponse.<BrandResponse>builder()
                .success(true)
                .message("Update Brand Successfully")
                .data(brandService.updateBrand(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Object> deleteBrand(@PathVariable Integer id) {
        brandService.deleteBrand(id);
        return ApiResponse.builder()
                .success(true)
                .message("Delete Brand Successfully")
                .data(null)
                .build();
    }
}
