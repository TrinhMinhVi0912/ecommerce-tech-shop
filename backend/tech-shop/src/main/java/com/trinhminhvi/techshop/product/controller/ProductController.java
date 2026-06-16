package com.trinhminhvi.techshop.product.controller;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trinhminhvi.techshop.common.ApiResponse;
import com.trinhminhvi.techshop.common.PageableResponse;
import com.trinhminhvi.techshop.product.dto.request.GetProductsRequest;
import com.trinhminhvi.techshop.product.dto.response.ProductDetailResponse;
import com.trinhminhvi.techshop.product.dto.response.ProductResponse;
import com.trinhminhvi.techshop.product.service.ProductService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/products")
@CrossOrigin("*")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // @RequestParam(required = false,defaultValue = "5") Integer pageSize,
    // @RequestParam(required = false,defaultValue = "1") Integer pageNum,
    // @RequestParam(required = false, defaultValue = "productId") String sortBy,
    // @RequestParam(required = false,defaultValue = "ASC") String sortDir,
    // @RequestParam(required = false) String search

    @GetMapping
    public ApiResponse<PageableResponse<List<ProductResponse>>> getAllProduct(GetProductsRequest getAllProductRequest) {
        Sort sort = null;
        if (getAllProductRequest.getSortDir().equalsIgnoreCase("ASC")) {
            sort = Sort.by(getAllProductRequest.getSortBy()).ascending();
        } else {
            sort = Sort.by(getAllProductRequest.getSortBy()).descending();
        }
        return ApiResponse.<PageableResponse<List<ProductResponse>>>builder()
                .success(true)
                .message("Get Products Successfully")
                .data(productService.getAllProduct(PageRequest.of(
                        getAllProductRequest.getPageNum() - 1,
                        getAllProductRequest.getPageSize(),
                        sort), getAllProductRequest))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<ProductDetailResponse> getProductById(@PathVariable Integer id) {
        return ApiResponse.<ProductDetailResponse>builder()
                .success(true)
                .message("Get Detail Product Successfully")
                .data(productService.getProductById(id))
                .build();
    }
}
