package com.trinhminhvi.techshop.product.service;

import java.util.List;
import org.springframework.data.domain.Pageable;

import com.trinhminhvi.techshop.common.PageableResponse;
import com.trinhminhvi.techshop.product.dto.request.GetProductsRequest;
import com.trinhminhvi.techshop.product.dto.response.ProductDetailResponse;
import com.trinhminhvi.techshop.product.dto.response.ProductResponse;

public interface ProductService {
    public PageableResponse<List<ProductResponse>> getAllProduct(Pageable pageable,GetProductsRequest getAllProductRequest);
    public ProductDetailResponse getProductById(Integer id);
}
