package com.trinhminhvi.techshop.service;

import java.util.List;
import org.springframework.data.domain.Pageable;

import com.trinhminhvi.techshop.dto.request.GetProductsRequest;
import com.trinhminhvi.techshop.dto.response.PageableResponse;
import com.trinhminhvi.techshop.dto.response.ProductDetailResponse;
import com.trinhminhvi.techshop.dto.response.ProductResponse;

public interface ProductService {
    public PageableResponse<List<ProductResponse>> getAllProduct(Pageable pageable,GetProductsRequest getAllProductRequest);
    public ProductDetailResponse getProductById(Integer id);
}
