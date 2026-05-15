package com.trinhminhvi.techshop.service.impl;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.trinhminhvi.techshop.dto.response.ProductResponse;
import com.trinhminhvi.techshop.entity.Product;
import com.trinhminhvi.techshop.mapper.ProductMapper;
import com.trinhminhvi.techshop.repository.ProductRepository;
import com.trinhminhvi.techshop.service.ProductService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService{

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Override
    public List<ProductResponse> getAllProduct(Pageable pageable) {
        List<Product> listProducts = productRepository.findAll(pageable).getContent();
        return listProducts.stream()
        .map(product -> productMapper.toProductResponse(product))
        .toList();
    }

    @Override
    public ProductResponse getProductById(Integer id) {
        return productMapper.toProductResponse(
            productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"))
        );
    }
    
}
