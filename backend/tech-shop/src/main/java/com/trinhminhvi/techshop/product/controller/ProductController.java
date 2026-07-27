package com.trinhminhvi.techshop.product.controller;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trinhminhvi.techshop.common.ApiResponse;
import com.trinhminhvi.techshop.common.PageableResponse;
import com.trinhminhvi.techshop.product.dto.request.CreateProductRequest;
import com.trinhminhvi.techshop.product.dto.request.GetProductsRequest;
import com.trinhminhvi.techshop.product.dto.request.UpdateProductRequest;
import com.trinhminhvi.techshop.product.dto.response.CompareProductResponse;
import com.trinhminhvi.techshop.product.dto.response.ProductDetailResponse;
import com.trinhminhvi.techshop.product.dto.response.ProductResponse;
import com.trinhminhvi.techshop.product.service.ProductService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

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

    @GetMapping("/compare")
    public ApiResponse<CompareProductResponse> compareProducts(
            @RequestParam Integer productId1,
            @RequestParam Integer productId2) {

        return ApiResponse.<CompareProductResponse>builder()
                .success(true)
                .message("Compare products successfully.")
                .data(productService.compareProducts(productId1, productId2))
                .build();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<ProductDetailResponse> createProduct(
            @RequestPart("product") String productJson,
            @RequestPart("images") List<MultipartFile> images) throws Exception {

        ObjectMapper objectMapper = new ObjectMapper();

        CreateProductRequest request = objectMapper.readValue(productJson, CreateProductRequest.class);

        return ApiResponse.success(
                productService.createProduct(request, images),
                "Create Product Successfully");
    }

    // @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    // public ApiResponse<ProductDetailResponse> createProduct(
    // @RequestPart("product") @Validated CreateProductRequest request,
    // @RequestPart("images") List<MultipartFile> images) {

    // return ApiResponse.success(
    // productService.createProduct(request, images),
    // "Create Product Successfully");
    // }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<ProductDetailResponse> updateProduct(
            @PathVariable Integer id,
            @RequestPart("product") String productJson,
            @RequestPart(value = "images", required = false) List<MultipartFile> images)
            throws Exception {

        ObjectMapper objectMapper = new ObjectMapper();

        UpdateProductRequest request = objectMapper.readValue(productJson, UpdateProductRequest.class);

        return ApiResponse.success(
                productService.updateProduct(id, request, images),
                "Update Product Successfully");
    }

    // @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    // public ApiResponse<ProductDetailResponse> updateProduct(
    //         @PathVariable Integer id,
    //         @RequestPart("product") @Validated UpdateProductRequest request,
    //         @RequestPart(value = "images", required = false) List<MultipartFile> images) {

    //     return ApiResponse.success(
    //             productService.updateProduct(id, request, images),
    //             "Update Product Successfully");
    // }
}
