package com.trinhminhvi.techshop.product.controller;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trinhminhvi.techshop.common.ApiResponse;
import com.trinhminhvi.techshop.common.PageableResponse;
import com.trinhminhvi.techshop.product.dto.request.CreateProductRequest;
import com.trinhminhvi.techshop.product.dto.request.GetProductsRequest;
import com.trinhminhvi.techshop.product.dto.request.UpdateProductRequest;
import com.trinhminhvi.techshop.product.dto.request.UpdateProductStatusRequest;
import com.trinhminhvi.techshop.product.dto.response.ProductDetailForAdminResponse;
import com.trinhminhvi.techshop.product.dto.response.ProductForAdminResponse;
import com.trinhminhvi.techshop.product.service.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/products")
@CrossOrigin("*")
@RequiredArgsConstructor
public class ProductAdminController {

    private final ProductService productService;

    @GetMapping
    public ApiResponse<PageableResponse<List<ProductForAdminResponse>>> getAllProductsForAdmin(
            @ModelAttribute GetProductsRequest request) {

        Pageable pageable = PageRequest.of(
                request.getPageNum() - 1,
                request.getPageSize(),
                Sort.by(
                        Sort.Direction.fromString(request.getSortDir()),
                        request.getSortBy()));

        return ApiResponse.success(
                productService.getAllProductsForAdmin(pageable, request),
                "Get All Products Successfully");
    }

    @GetMapping("/{id}")
    public ApiResponse<ProductDetailForAdminResponse> getProductByIdForAdmin(
            @PathVariable Integer id) {

        return ApiResponse.success(
                productService.getProductByIdForAdmin(id),
                "Get Product Successfully");
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<ProductDetailForAdminResponse> createProduct(
            @RequestPart("product") String productJson,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) throws Exception {

        ObjectMapper objectMapper = new ObjectMapper();
        CreateProductRequest request = objectMapper.readValue(productJson, CreateProductRequest.class);

        return ApiResponse.success(
                productService.createProduct(request, images),
                "Create Product Successfully");
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<ProductDetailForAdminResponse> updateProduct(
            @PathVariable Integer id,
            @RequestPart("product") String productJson,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) throws Exception {

        ObjectMapper objectMapper = new ObjectMapper();
        UpdateProductRequest request = objectMapper.readValue(productJson, UpdateProductRequest.class);

        return ApiResponse.success(
                productService.updateProduct(id, request, images),
                "Update Product Successfully");
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<ProductDetailForAdminResponse> updateProductStatus(
            @PathVariable Integer id,
            @RequestBody @Validated UpdateProductStatusRequest request) {

        return ApiResponse.success(
                productService.updateProductStatus(id, request),
                "Update Product Status Successfully");
    }
}
