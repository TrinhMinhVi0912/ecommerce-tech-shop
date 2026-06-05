package com.trinhminhvi.techshop.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.trinhminhvi.techshop.dto.request.GetProductsRequest;
import com.trinhminhvi.techshop.dto.response.AttriubutesValueResponse;
import com.trinhminhvi.techshop.dto.response.PageableResponse;
import com.trinhminhvi.techshop.dto.response.ProductDetailResponse;
import com.trinhminhvi.techshop.dto.response.ProductImageResponse;
import com.trinhminhvi.techshop.dto.response.ProductResponse;
import com.trinhminhvi.techshop.dto.response.ProductReviewResponse;
import com.trinhminhvi.techshop.dto.response.ProductVariantResponse;
import com.trinhminhvi.techshop.dto.response.ReviewResponse;
import com.trinhminhvi.techshop.dto.response.SummaryReviewProduct;
import com.trinhminhvi.techshop.dto.response.UserResponse;
import com.trinhminhvi.techshop.entity.Product;
import com.trinhminhvi.techshop.entity.ProductImage;
import com.trinhminhvi.techshop.entity.ProductVariant;
import com.trinhminhvi.techshop.entity.Review;
import com.trinhminhvi.techshop.mapper.BrandMapper;
import com.trinhminhvi.techshop.mapper.CategoryMapper;
import com.trinhminhvi.techshop.mapper.ProductImageMapper;
import com.trinhminhvi.techshop.mapper.ProductMapper;
import com.trinhminhvi.techshop.mapper.ProductVariantMapper;
import com.trinhminhvi.techshop.repository.ProductImageRepository;
import com.trinhminhvi.techshop.repository.ProductRepository;
import com.trinhminhvi.techshop.repository.ProductVariantRepository;
import com.trinhminhvi.techshop.repository.ReviewRepository;
import com.trinhminhvi.techshop.repository.UserRepository;
import com.trinhminhvi.techshop.repository.VariantAttributeRepository;
import com.trinhminhvi.techshop.service.ProductService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final VariantAttributeRepository variantAttributeRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductImageRepository productImageRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;

    private final ProductMapper productMapper;
    private final BrandMapper brandMapper;
    private final CategoryMapper categoryMapper;
    private final ProductVariantMapper productVariantMapper;
    private final ProductImageMapper productImageMapper;

    @Override
    public PageableResponse<List<ProductResponse>> getAllProduct(Pageable pageable,
            GetProductsRequest getAllProductRequest) {
        Page<Product> pageProducts = productRepository.searchProduct(
                getAllProductRequest.getSearch(),
                getAllProductRequest.getMinPrice(),
                getAllProductRequest.getMaxPrice(),
                getAllProductRequest.getBrandId(),
                getAllProductRequest.getCategoryId(),
                pageable);

        List<ProductResponse> listProductResponse = pageProducts.getContent().stream()
                .map(product -> {
                    ProductResponse productResponse = productMapper.toProductResponse(product);
                    productResponse.setThumbnailImagePath(product.getThumbnailPath());
                    return productResponse;
                })
                .toList();

        return PageableResponse.<List<ProductResponse>>builder()
                .pageNum(getAllProductRequest.getPageNum())
                .pageSize(getAllProductRequest.getPageSize())
                .totalElements(pageProducts.getTotalElements())
                .totalPages(pageProducts.getTotalPages())
                .items(listProductResponse)
                .build();
    }

    @Override
    public ProductDetailResponse getProductById(Integer id) {
        Product product = productRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Product Not Found"));

        List<ProductVariant> listVariantAndAtributes = productVariantRepository.findAllByProductWithAttributes(product);
        List<ProductImage> listProductImages = productImageRepository.findAllByProduct(product);

        return ProductDetailResponse.builder()
                .productId(product.getProductId())
                .basePrice(product.getBasePrice())
                .name(product.getName())
                .description(product.getDescription())
                .brandResponse(brandMapper.toBrandResponse(product.getBrand()))
                .categoryResponse(categoryMapper.toCategoryResponse(product.getCategory()))

                .images(listProductImages.stream().map(p -> {
                    return ProductImageResponse.builder()
                            .imagePath(p.getImagePath())
                            .isThumbnail(p.isThumbnail())
                            .build();
                }).toList())

                .variants(listVariantAndAtributes.stream().map(p -> {
                    ProductVariantResponse productVariantResponse = productVariantMapper.toProductVariantResponse(p);
                    productVariantResponse.setAttributes(
                            p.getVariantAttributes().stream().map(
                                    va -> {
                                        AttriubutesValueResponse attriubutesValueResponse = AttriubutesValueResponse
                                                .builder()
                                                .name(va.getAttrValue().getAttribute().getName())
                                                .value(va.getAttrValue().getValue())
                                                .build();
                                        return attriubutesValueResponse;
                                    }).toList());
                    return productVariantResponse;
                }).toList()) //

                .build();
    }

}
