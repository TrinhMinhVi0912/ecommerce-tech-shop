package com.trinhminhvi.techshop.service;

import java.util.List;
import org.springframework.data.domain.Pageable;

import com.trinhminhvi.techshop.dto.request.GetAllProductRequest;
import com.trinhminhvi.techshop.dto.response.ProductDetailResponse;
import com.trinhminhvi.techshop.dto.response.ProductResponse;

public interface ProductService {
    public List<ProductResponse> getAllProduct(Pageable pageable,GetAllProductRequest getAllProductRequest);
    public ProductDetailResponse getProductById(Integer id);
}
