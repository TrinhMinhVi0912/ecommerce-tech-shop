package com.trinhminhvi.techshop.product.service;

import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.trinhminhvi.techshop.common.PageableResponse;
import com.trinhminhvi.techshop.product.dto.request.CreateProductRequest;
import com.trinhminhvi.techshop.product.dto.request.GetProductsRequest;
import com.trinhminhvi.techshop.product.dto.response.CompareProductResponse;
import com.trinhminhvi.techshop.product.dto.response.ProductDetailResponse;
import com.trinhminhvi.techshop.product.dto.response.ProductResponse;

public interface ProductService {
    
    public PageableResponse<List<ProductResponse>> getAllProduct(Pageable pageable, GetProductsRequest getAllProductRequest);

    public ProductDetailResponse getProductById(Integer id);

    CompareProductResponse compareProducts(Integer productId1, Integer productId2);

    ProductDetailResponse createProduct(CreateProductRequest request, List<MultipartFile> images);
}
