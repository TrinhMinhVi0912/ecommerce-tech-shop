package com.trinhminhvi.techshop.brand.service.impl;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trinhminhvi.techshop.brand.dto.request.CreateBrandRequest;
import com.trinhminhvi.techshop.brand.dto.request.GetBrandsRequest;
import com.trinhminhvi.techshop.brand.dto.request.UpdateBrandRequest;
import com.trinhminhvi.techshop.brand.dto.response.BrandResponse;
import com.trinhminhvi.techshop.brand.entity.Brand;
import com.trinhminhvi.techshop.brand.mapper.BrandMapper;
import com.trinhminhvi.techshop.brand.repository.BrandRepository;
import com.trinhminhvi.techshop.brand.service.BrandService;
import com.trinhminhvi.techshop.common.PageableResponse;
import com.trinhminhvi.techshop.product.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BrandServiceImpl implements BrandService {

    private final BrandRepository brandRepository;
    private final ProductRepository productRepository;
    private final BrandMapper brandMapper;

    @Override
    @Transactional(readOnly = true)
    public PageableResponse<List<BrandResponse>> getAllBrands(Pageable pageable, GetBrandsRequest getBrandsRequest) {
        Page<Brand> pageBrands = brandRepository.searchBrands(
                getBrandsRequest.getSearch(),
                pageable);

        List<BrandResponse> listBrandResponses = pageBrands.getContent().stream()
                .map(brandMapper::toBrandResponse)
                .toList();

        return PageableResponse.<List<BrandResponse>>builder()
                .pageNum(getBrandsRequest.getPageNum())
                .pageSize(getBrandsRequest.getPageSize())
                .totalElements(pageBrands.getTotalElements())
                .totalPages(pageBrands.getTotalPages())
                .items(listBrandResponses)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public BrandResponse getBrandById(Integer id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brand not found."));

        return brandMapper.toBrandResponse(brand);
    }

    @Override
    @Transactional
    public BrandResponse createBrand(CreateBrandRequest request) {
        String trimmedName = request.getName() != null ? request.getName().trim() : "";

        if (brandRepository.existsByNameIgnoreCaseTrim(trimmedName)) {
            throw new RuntimeException("Brand name already exists.");
        }

        Brand brand = brandMapper.toBrand(request);
        brand.setName(trimmedName);

        Brand savedBrand = brandRepository.save(brand);
        return brandMapper.toBrandResponse(savedBrand);
    }

    @Override
    @Transactional
    public BrandResponse updateBrand(Integer id, UpdateBrandRequest request) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brand not found."));

        String trimmedName = request.getName() != null ? request.getName().trim() : "";

        if (brandRepository.existsByNameIgnoreCaseTrimAndBrandIdNot(trimmedName, id)) {
            throw new RuntimeException("Brand name already exists.");
        }

        brandMapper.updateBrandFromRequest(request, brand);
        brand.setName(trimmedName);

        Brand updatedBrand = brandRepository.save(brand);
        return brandMapper.toBrandResponse(updatedBrand);
    }

    @Override
    @Transactional
    public void deleteBrand(Integer id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brand not found."));

        if (productRepository.existsByBrandBrandId(id)) {
            throw new RuntimeException("Brand contains products. Cannot delete.");
        }

        brandRepository.delete(brand);
    }
}
