package com.trinhminhvi.techshop.service.impl;

import java.util.List;
import java.util.Locale.Category;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.trinhminhvi.techshop.dto.request.GetAllProductRequest;
import com.trinhminhvi.techshop.dto.response.ProductDetailResponse;
import com.trinhminhvi.techshop.dto.response.ProductResponse;
import com.trinhminhvi.techshop.entity.Product;
import com.trinhminhvi.techshop.mapper.BrandMapper;
import com.trinhminhvi.techshop.mapper.CategoryMapper;
import com.trinhminhvi.techshop.mapper.ProductMapper;
import com.trinhminhvi.techshop.repository.BrandRepository;
import com.trinhminhvi.techshop.repository.CategoryRepository;
import com.trinhminhvi.techshop.repository.ProductRepository;
import com.trinhminhvi.techshop.service.ProductService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;
    private final BrandMapper brandMapper;
    private final CategoryMapper categoryMapper;

    @Override
    public List<ProductResponse> getAllProduct(Pageable pageable,GetAllProductRequest getAllProductRequest) {
        List<Product> listProducts = productRepository.searchProduct(
            getAllProductRequest.getSearch(),
            getAllProductRequest.getMinPrice(),
            getAllProductRequest.getMaxPrice(),
            getAllProductRequest.getBrandId(),
            getAllProductRequest.getCategoryId(),
            pageable
        ).getContent();
        return listProducts.stream()
        .map(product -> productMapper.toProductResponse(product))
        .toList();
    }

    @Override
    public ProductDetailResponse getProductById(Integer id) {
        Product product = productRepository.findById(id).orElseThrow(
            () -> new RuntimeException("Product Not Found"));
        return ProductDetailResponse.builder()
        .productId(product.getProductId())
        .basePrice(product.getBasePrice())
        .name(product.getName())
        .description(product.getDescription())
        .brandResponse(brandMapper.toBrandResponse(product.getBrand()))
        .categoryResponse(categoryMapper.toCategoryResponse(product.getCategory()))
        .build();
    }

}
