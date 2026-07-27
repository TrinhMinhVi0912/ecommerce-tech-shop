package com.trinhminhvi.techshop.product.service;

import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.trinhminhvi.techshop.common.PageableResponse;
import com.trinhminhvi.techshop.product.dto.request.CreateProductRequest;
import com.trinhminhvi.techshop.product.dto.request.GetProductsRequest;
import com.trinhminhvi.techshop.product.dto.request.UpdateProductRequest;
import com.trinhminhvi.techshop.product.dto.request.UpdateProductStatusRequest;
import com.trinhminhvi.techshop.product.dto.response.CompareProductResponse;
import com.trinhminhvi.techshop.product.dto.response.ProductDetailForAdminResponse;
import com.trinhminhvi.techshop.product.dto.response.ProductDetailResponse;
import com.trinhminhvi.techshop.product.dto.response.ProductForAdminResponse;
import com.trinhminhvi.techshop.product.dto.response.ProductResponse;

public interface ProductService {

    public PageableResponse<List<ProductResponse>> getAllProductForCustomer(Pageable pageable,
            GetProductsRequest getAllProductRequest);

    public ProductDetailResponse getProductByIdForCustomer(Integer id);

    public PageableResponse<List<ProductForAdminResponse>> getAllProductsForAdmin(Pageable pageable, GetProductsRequest request);

    public ProductDetailForAdminResponse getProductByIdForAdmin(
            Integer productId);

    public CompareProductResponse compareProducts(Integer productId1, Integer productId2);

    public ProductDetailForAdminResponse createProduct(CreateProductRequest request, List<MultipartFile> images);

    public ProductDetailForAdminResponse updateProduct(Integer productId, UpdateProductRequest request, List<MultipartFile> newImages);

    public ProductDetailForAdminResponse updateProductStatus(Integer productId, UpdateProductStatusRequest request);
}
