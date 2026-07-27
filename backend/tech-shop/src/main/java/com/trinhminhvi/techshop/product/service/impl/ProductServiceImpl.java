package com.trinhminhvi.techshop.product.service.impl;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.trinhminhvi.techshop.brand.entity.Brand;
import com.trinhminhvi.techshop.brand.mapper.BrandMapper;
import com.trinhminhvi.techshop.brand.repository.BrandRepository;
import com.trinhminhvi.techshop.category.entity.Category;
import com.trinhminhvi.techshop.category.mapper.CategoryMapper;
import com.trinhminhvi.techshop.category.repository.CategoryRepository;
import com.trinhminhvi.techshop.common.PageableResponse;
import com.trinhminhvi.techshop.product.dto.request.CreateProductRequest;
import com.trinhminhvi.techshop.product.dto.request.CreateVariantAttributeRequest;
import com.trinhminhvi.techshop.product.dto.request.CreateVariantRequest;
import com.trinhminhvi.techshop.product.dto.request.GetProductsRequest;
import com.trinhminhvi.techshop.product.dto.request.UpdateProductRequest;
import com.trinhminhvi.techshop.product.dto.request.UpdateVariantRequest;
import com.trinhminhvi.techshop.product.dto.response.AttriubutesValueResponse;
import com.trinhminhvi.techshop.product.dto.response.CompareItemResponse;
import com.trinhminhvi.techshop.product.dto.response.CompareProductResponse;
import com.trinhminhvi.techshop.product.dto.response.ProductDetailResponse;
import com.trinhminhvi.techshop.product.dto.response.ProductImageResponse;
import com.trinhminhvi.techshop.product.dto.response.ProductResponse;
import com.trinhminhvi.techshop.product.dto.response.ProductVariantResponse;
import com.trinhminhvi.techshop.product.entity.Attribute;
import com.trinhminhvi.techshop.product.entity.AttributeValue;
import com.trinhminhvi.techshop.product.entity.Product;
import com.trinhminhvi.techshop.product.entity.ProductImage;
import com.trinhminhvi.techshop.product.entity.ProductVariant;
import com.trinhminhvi.techshop.product.entity.VariantAttribute;
import com.trinhminhvi.techshop.product.entity.VariantAttributeId;
import com.trinhminhvi.techshop.product.enums.ImageExtension;
import com.trinhminhvi.techshop.product.mapper.ProductImageMapper;
import com.trinhminhvi.techshop.product.mapper.ProductMapper;
import com.trinhminhvi.techshop.product.mapper.ProductVariantMapper;
import com.trinhminhvi.techshop.product.repository.AttributeRepository;
import com.trinhminhvi.techshop.product.repository.AttributeValueRepository;
import com.trinhminhvi.techshop.product.repository.ProductImageRepository;
import com.trinhminhvi.techshop.product.repository.ProductRepository;
import com.trinhminhvi.techshop.product.repository.ProductVariantRepository;
import com.trinhminhvi.techshop.product.repository.VariantAttributeRepository;
import com.trinhminhvi.techshop.product.service.ProductService;
import com.trinhminhvi.techshop.review.repository.ReviewRepository;
import com.trinhminhvi.techshop.user.repository.UserRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

        private final ProductRepository productRepository;
        private final VariantAttributeRepository variantAttributeRepository;
        private final ProductVariantRepository productVariantRepository;
        private final ProductImageRepository productImageRepository;
        private final AttributeRepository attributeRepository;
        private final AttributeValueRepository attributeValueRepository;
        private final BrandRepository brandRepository;
        private final CategoryRepository categoryRepository;
        private final UserRepository userRepository;
        private final ReviewRepository reviewRepository;

        private final ProductMapper productMapper;
        private final BrandMapper brandMapper;
        private final CategoryMapper categoryMapper;
        private final ProductVariantMapper productVariantMapper;
        private final ProductImageMapper productImageMapper;

        @PersistenceContext
        private EntityManager entityManager;

        private static final String UPLOAD_DIR = "backend/tech-shop/src/main/resources/static/images/products";

        // Helper cho so sánh sản phẩm
        private CompareItemResponse buildCompareItem(Product product) {

                List<ProductVariant> variants = productVariantRepository
                                .findAllByProductWithAttributes(product);

                List<ProductImage> images = productImageRepository
                                .findAllByProduct(product);

                String thumbnail = images.stream()
                                .filter(ProductImage::isThumbnail)
                                .map(ProductImage::getImagePath)
                                .findFirst()
                                .orElse("/images/products/default.jpg");

                return CompareItemResponse.builder()
                                .productId(product.getProductId())
                                .name(product.getName())
                                .description(product.getDescription())
                                .basePrice(product.getBasePrice())
                                .brandResponse(brandMapper.toBrandResponse(product.getBrand()))
                                .categoryResponse(categoryMapper.toCategoryResponse(product.getCategory()))
                                .thumbnailImagePath(thumbnail)

                                .variants(
                                                variants.stream().map(v -> {

                                                        ProductVariantResponse response = productVariantMapper
                                                                        .toProductVariantResponse(v);

                                                        response.setAttributes(
                                                                        v.getVariantAttributes().stream()
                                                                                        .map(va -> AttriubutesValueResponse
                                                                                                        .builder()
                                                                                                        .name(va.getAttrValue()
                                                                                                                        .getAttribute()
                                                                                                                        .getName())
                                                                                                        .value(va.getAttrValue()
                                                                                                                        .getValue())
                                                                                                        .build())
                                                                                        .toList());

                                                        return response;

                                                }).toList())

                                .build();
        }

        // Helper dành cho thêm sản phẩm

        // Validate các thông tin requset tạo sản phẩm
        private void validateProduct(CreateProductRequest request) {

                String productName = request.getName().trim();

                if (productRepository.existsByNameIgnoreCaseTrim(productName)) {
                        throw new RuntimeException("Product name already exists.");
                }

                if (!brandRepository.existsById(request.getBrandId())) {
                        throw new RuntimeException("Brand not found.");
                }

                if (!categoryRepository.existsById(request.getCategoryId())) {
                        throw new RuntimeException("Category not found.");
                }

                if (request.getBasePrice().compareTo(BigDecimal.ZERO) <= 0) {
                        throw new RuntimeException("Base price must be greater than zero.");
                }
        }

        // validate các ảnh được gửi lên
        private void validateImages(
                        Integer thumbnailIndex,
                        List<MultipartFile> images) {

                if (images == null || images.size() < 2 || images.size() > 7) {
                        throw new RuntimeException("Product must have from 2 to 7 images.");
                }

                for (MultipartFile image : images) {

                        if (image.isEmpty()) {
                                throw new RuntimeException("Image cannot be empty.");
                        }

                        String filename = image.getOriginalFilename();

                        if (filename == null || !filename.contains(".")) {
                                throw new RuntimeException("Invalid image file.");
                        }

                        String extension = filename.substring(filename.lastIndexOf('.') + 1);

                        if (!ImageExtension.isSupported(extension)) {
                                throw new RuntimeException("Only jpg, jpeg, png and webp images are allowed.");
                        }
                }

                if (thumbnailIndex != null
                                && (thumbnailIndex < 0 || thumbnailIndex >= images.size())) {
                        throw new RuntimeException("Invalid thumbnail index.");
                }
        }

        private void validateVariantAttributes(
                        List<CreateVariantAttributeRequest> attributes) {

                if (attributes == null || attributes.isEmpty()) {
                        throw new RuntimeException("Variant must have at least one attribute.");
                }

                Set<String> attributeNames = new HashSet<>();

                for (CreateVariantAttributeRequest attribute : attributes) {

                        String attributeName = attribute.getAttributeName().trim().toLowerCase();

                        if (!attributeNames.add(attributeName)) {
                                throw new RuntimeException(
                                                "Duplicate attribute name: " + attribute.getAttributeName());
                        }
                }
        }

        private void validateVariant(CreateVariantRequest variant) {

                if (variant.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
                        throw new RuntimeException("Variant price must be greater than zero.");
                }

                if (variant.getStock() < 0) {
                        throw new RuntimeException("Variant stock cannot be negative.");
                }

                validateVariantAttributes(variant.getAttributes());
        }

        private void validateVariants(
                        List<CreateVariantRequest> variants) {

                if (variants == null || variants.isEmpty()) {
                        throw new RuntimeException("Product must have at least one variant.");
                }

                for (CreateVariantRequest variant : variants) {
                        validateVariant(variant);
                }
        }

        private Product saveProduct(CreateProductRequest request) {

                Brand brand = brandRepository.findById(request.getBrandId())
                                .orElseThrow(() -> new RuntimeException("Brand not found."));

                Category category = categoryRepository.findById(request.getCategoryId())
                                .orElseThrow(() -> new RuntimeException("Category not found."));

                Product product = productMapper.toProduct(request);

                product.setName(request.getName().trim());
                product.setDescription(request.getDescription().trim());

                product.setBrand(brand);
                product.setCategory(category);

                return productRepository.save(product);
        }

        private List<ProductImage> uploadProductImages(
                        Product product,
                        List<MultipartFile> images,
                        Integer thumbnailIndex,
                        List<Path> savedFiles) {
                try {
                        Path uploadPath = Paths.get(UPLOAD_DIR);

                        // System.out.println("Working dir : " + Paths.get("").toAbsolutePath());
                        // System.out.println("Upload dir : " + uploadPath.toAbsolutePath());
                        // System.out.println("Exists : " + Files.exists(uploadPath));

                        if (!Files.exists(uploadPath)) {
                                Files.createDirectories(uploadPath);
                        }

                        List<ProductImage> productImages = new ArrayList<>();

                        for (int i = 0; i < images.size(); i++) {

                                MultipartFile imageFile = images.get(i);

                                String originalFilename = StringUtils.cleanPath(imageFile.getOriginalFilename());

                                String extension = originalFilename.substring(originalFilename.lastIndexOf('.'));

                                String uuidFileName = UUID.randomUUID() + extension;

                                Path filePath = uploadPath.resolve(uuidFileName);

                                Files.copy(
                                                imageFile.getInputStream(),
                                                filePath,
                                                StandardCopyOption.REPLACE_EXISTING);

                                System.out.println("Saved file : " + filePath.toAbsolutePath());
                                System.out.println("File exists: " + Files.exists(filePath));

                                savedFiles.add(filePath);

                                ProductImage productImage = ProductImage.builder()
                                                .product(product)
                                                .imagePath("/images/products/" + uuidFileName)
                                                .isThumbnail(thumbnailIndex == null ? i == 0 : i == thumbnailIndex)
                                                .build();

                                productImages.add(productImage);
                        }

                        return productImageRepository.saveAll(productImages);
                } catch (IOException e) {
                        throw new RuntimeException("Upload product images failed.", e);
                }
        }

        private String generateSkuIfNeeded(String sku) {

                if (sku != null && !sku.isBlank()) {
                        return sku.trim();
                }

                return "SKU-" + UUID.randomUUID()
                                .toString()
                                .substring(0, 8)
                                .toUpperCase();
        }

        private AttributeValue getOrCreateAttributeValue(
                        CreateVariantAttributeRequest request) {

                String attributeName = request.getAttributeName().trim();
                String attributeValue = request.getAttributeValue().trim();

                Attribute attribute = attributeRepository
                                .findByNameIgnoreCase(attributeName)
                                .orElseGet(() -> attributeRepository.save(
                                                Attribute.builder()
                                                                .name(attributeName)
                                                                .build()));

                return attributeValueRepository
                                .findByAttributeAndValueIgnoreCase(attribute, attributeValue)
                                .orElseGet(() -> attributeValueRepository.save(
                                                AttributeValue.builder()
                                                                .attribute(attribute)
                                                                .value(attributeValue)
                                                                .build()));
        }

        private List<AttriubutesValueResponse> saveVariantAttributes(
                        ProductVariant variant,
                        List<CreateVariantAttributeRequest> attributeRequests) {

                List<AttriubutesValueResponse> responses = new ArrayList<>();

                for (CreateVariantAttributeRequest request : attributeRequests) {

                        AttributeValue attributeValue = getOrCreateAttributeValue(request);

                        VariantAttribute variantAttribute = VariantAttribute.builder()
                                        .id(VariantAttributeId.builder()
                                                        .variantId(variant.getVariantId())
                                                        .attrValueId(attributeValue.getAttrValueId())
                                                        .build())
                                        .variant(variant)
                                        .attrValue(attributeValue)
                                        .build();

                        variantAttributeRepository.save(variantAttribute);

                        responses.add(
                                        AttriubutesValueResponse.builder()
                                                        .name(attributeValue.getAttribute().getName())
                                                        .value(attributeValue.getValue())
                                                        .build());
                }

                return responses;
        }

        private List<ProductVariantResponse> saveProductVariants(
                        Product product,
                        List<CreateVariantRequest> variantRequests) {

                List<ProductVariantResponse> responses = new ArrayList<>();

                for (CreateVariantRequest variantRequest : variantRequests) {

                        ProductVariant variant = ProductVariant.builder()
                                        .product(product)
                                        .price(variantRequest.getPrice())
                                        .stock(variantRequest.getStock())
                                        .sku(generateSkuIfNeeded(variantRequest.getSku()))
                                        .build();

                        ProductVariant savedVariant = productVariantRepository.save(variant);

                        List<AttriubutesValueResponse> attributeResponses = saveVariantAttributes(savedVariant,
                                        variantRequest.getAttributes());

                        responses.add(
                                        ProductVariantResponse.builder()
                                                        .variantId(savedVariant.getVariantId())
                                                        .price(savedVariant.getPrice())
                                                        .stock(savedVariant.getStock())
                                                        .sku(savedVariant.getSku())
                                                        .attributes(attributeResponses)
                                                        .build());
                }

                return responses;
        }

        private void cleanupUploadedFiles(List<Path> savedFiles) {

                for (Path file : savedFiles) {
                        try {
                                Files.deleteIfExists(file);
                        } catch (IOException ex) {
                                ex.printStackTrace();
                        }
                }
        }

        private void validateCreateProduct(
                        CreateProductRequest request,
                        List<MultipartFile> images) {

                validateProduct(request);

                validateImages(
                                request.getThumbnailIndex(),
                                images);

                validateVariants(
                                request.getVariants());
        }

        // Helper dành cho update product
        private void validateProductName(
                        Integer productId,
                        String productName) {

                String trimmedName = productName.trim();

                if (productRepository.existsByNameIgnoreCaseAndProductIdNot(
                                trimmedName,
                                productId)) {

                        throw new RuntimeException("Product name already exists.");
                }
        }

        private void validateBrandAndCategory(
                        Integer brandId,
                        Integer categoryId) {

                if (!brandRepository.existsById(brandId)) {
                        throw new RuntimeException("Brand not found.");
                }

                if (!categoryRepository.existsById(categoryId)) {
                        throw new RuntimeException("Category not found.");
                }
        }

        private void validateImages(
                        List<String> existingImages,
                        List<MultipartFile> newImages,
                        String thumbnail) {

                int oldImageCount = existingImages == null ? 0 : existingImages.size();
                int newImageCount = newImages == null ? 0 : newImages.size();

                int totalImages = oldImageCount + newImageCount;

                if (totalImages < 2 || totalImages > 7) {
                        throw new RuntimeException("Product must have from 2 to 7 images.");
                }

                if (newImages != null) {
                        for (MultipartFile image : newImages) {

                                if (image.isEmpty()) {
                                        throw new RuntimeException("Image cannot be empty.");
                                }

                                String filename = image.getOriginalFilename();

                                if (filename == null || !filename.contains(".")) {
                                        throw new RuntimeException("Invalid image file.");
                                }

                                String extension = filename.substring(filename.lastIndexOf('.') + 1);

                                if (!ImageExtension.isSupported(extension)) {
                                        throw new RuntimeException("Only jpg, jpeg, png and webp images are allowed.");
                                }
                        }
                }

                if (thumbnail == null || thumbnail.isBlank()) {
                        throw new RuntimeException("Thumbnail is required.");
                }

                boolean validThumbnail = false;

                // thumbnail là ảnh cũ
                if (existingImages != null && existingImages.contains(thumbnail)) {
                        validThumbnail = true;
                }

                // thumbnail là ảnh mới (new_0, new_1,...)
                if (!validThumbnail && thumbnail.startsWith("new_")) {

                        try {
                                int index = Integer.parseInt(thumbnail.substring(4));

                                if (newImages != null && index >= 0 && index < newImages.size()) {
                                        validThumbnail = true;
                                }

                        } catch (NumberFormatException ignored) {
                        }
                }

                if (!validThumbnail) {
                        throw new RuntimeException("Invalid thumbnail.");
                }
        }

        private void validateVariant(
                        UpdateVariantRequest variant) {

                if (variant.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
                        throw new RuntimeException("Variant price must be greater than zero.");
                }

                if (variant.getStock() < 0) {
                        throw new RuntimeException("Variant stock cannot be negative.");
                }
        }

        private void validateUpdateVariant(UpdateVariantRequest variant) {

                if (variant.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
                        throw new RuntimeException("Variant price must be greater than zero.");
                }

                if (variant.getStock() < 0) {
                        throw new RuntimeException("Variant stock cannot be negative.");
                }

                validateVariantAttributes(variant.getAttributes());
        }

        private void validateUpdateVariants(
                        List<UpdateVariantRequest> variants) {

                if (variants == null || variants.isEmpty()) {
                        throw new RuntimeException("Product must have at least one variant.");
                }

                Set<Integer> variantIds = new HashSet<>();

                for (UpdateVariantRequest variant : variants) {

                        validateVariant(variant);

                        if (variant.getVariantId() != null
                                        && !variantIds.add(variant.getVariantId())) {

                                throw new RuntimeException("Duplicate variant id.");
                        }
                }
        }

        private void validateUpdateProduct(
                        Integer productId,
                        UpdateProductRequest request,
                        List<MultipartFile> newImages) {

                validateProductName(productId, request.getName());

                validateBrandAndCategory(
                                request.getBrandId(),
                                request.getCategoryId());

                validateImages(
                                request.getExistingImages(),
                                newImages,
                                request.getThumbnail());

                validateUpdateVariants(request.getVariants());
        }

        private void deleteImageFile(String imagePath) {

                if (imagePath == null || imagePath.isBlank()) {
                        return;
                }

                try {

                        String fileName = Paths.get(imagePath).getFileName().toString();

                        Path filePath = Paths.get(UPLOAD_DIR).resolve(fileName);

                        Files.deleteIfExists(filePath);

                } catch (IOException e) {
                        throw new RuntimeException("Delete image file failed.", e);
                }
        }

        // giống uploads ở trên create nhưng khác chổ xác định thumnail
        private List<ProductImage> uploadNewImages(
                        Product product,
                        List<MultipartFile> images,
                        List<Path> savedFiles) {

                if (images == null || images.isEmpty()) {
                        return new ArrayList<>();
                }

                try {

                        Path uploadPath = Paths.get(UPLOAD_DIR);

                        if (!Files.exists(uploadPath)) {
                                Files.createDirectories(uploadPath);
                        }

                        List<ProductImage> productImages = new ArrayList<>();

                        for (MultipartFile imageFile : images) {

                                String originalFilename = StringUtils.cleanPath(imageFile.getOriginalFilename());

                                String extension = originalFilename.substring(originalFilename.lastIndexOf('.'));

                                String uuidFileName = UUID.randomUUID() + extension;

                                Path filePath = uploadPath.resolve(uuidFileName);

                                Files.copy(
                                                imageFile.getInputStream(),
                                                filePath,
                                                StandardCopyOption.REPLACE_EXISTING);

                                savedFiles.add(filePath);

                                ProductImage productImage = ProductImage.builder()
                                                .product(product)
                                                .imagePath("/images/products/" + uuidFileName)
                                                .isThumbnail(false)
                                                .build();

                                productImages.add(productImage);
                        }

                        return productImageRepository.saveAll(productImages);

                } catch (IOException e) {
                        throw new RuntimeException("Upload product images failed.", e);
                }
        }

        // cập nhật thumbnail
        private void updateThumbnail(
                        List<ProductImage> allImages,
                        List<ProductImage> uploadedImages,
                        String thumbnail) {

                // Reset tất cả
                allImages.forEach(image -> image.setThumbnail(false));

                // Thumbnail là ảnh mới
                if (thumbnail.startsWith("new_")) {

                        int index;

                        try {
                                index = Integer.parseInt(thumbnail.substring(4));
                        } catch (NumberFormatException e) {
                                throw new RuntimeException("Invalid thumbnail.");
                        }

                        if (index < 0 || index >= uploadedImages.size()) {
                                throw new RuntimeException("Invalid thumbnail.");
                        }

                        uploadedImages.get(index).setThumbnail(true);
                        return;
                }

                // Thumbnail là ảnh cũ
                for (ProductImage image : allImages) {

                        if (image.getImagePath().equals(thumbnail)) {
                                image.setThumbnail(true);
                                return;
                        }
                }

                throw new RuntimeException("Thumbnail not found.");
        }

        // Đồng bộ ảnh với cơ sở dữ liệu
        private List<ProductImage> syncProductImages(
                        Product product,
                        List<String> existingImages,
                        List<MultipartFile> newImages,
                        String thumbnail,
                        List<Path> savedFiles) {

                List<ProductImage> currentImages = productImageRepository.findAllByProduct(product);

                List<ProductImage> remainingImages = new ArrayList<>();

                // Giữ ảnh cũ, xóa ảnh không còn trong request
                for (ProductImage image : currentImages) {

                        if (existingImages != null
                                        && existingImages.contains(image.getImagePath())) {

                                image.setThumbnail(false);
                                remainingImages.add(image);

                        } else {

                                deleteImageFile(image.getImagePath());

                                productImageRepository.delete(image);
                        }
                }

                /*
                 * Upload ảnh mới
                 */
                List<ProductImage> uploadedImages = uploadNewImages(product, newImages, savedFiles);

                remainingImages.addAll(uploadedImages);

                /*
                 * Cập nhật thumbnail
                 */
                updateThumbnail(
                                remainingImages,
                                uploadedImages,
                                thumbnail);

                return productImageRepository.saveAll(remainingImages);
        }

        private void deleteRemovedVariants(
                        List<ProductVariant> currentVariants,
                        Set<Integer> requestVariantIds) {

                for (ProductVariant variant : currentVariants) {

                        if (!requestVariantIds.contains(variant.getVariantId())) {

                                variantAttributeRepository.deleteAllByVariant(variant);

                                productVariantRepository.delete(variant);
                        }
                }
        }

        private void rebuildVariantAttributes(
                        ProductVariant variant,
                        List<CreateVariantAttributeRequest> requests) {

                variantAttributeRepository.deleteAllByVariant(variant);

                List<VariantAttribute> variantAttributes = new ArrayList<>();

                for (CreateVariantAttributeRequest request : requests) {

                        AttributeValue attributeValue = getOrCreateAttributeValue(request);

                        VariantAttribute variantAttribute = VariantAttribute.builder()
                                        .id(VariantAttributeId.builder()
                                                        .variantId(variant.getVariantId())
                                                        .attrValueId(attributeValue.getAttrValueId())
                                                        .build())
                                        .variant(variant)
                                        .attrValue(attributeValue)
                                        .build();

                        variantAttributes.add(variantAttribute);
                }

                variantAttributeRepository.saveAll(variantAttributes);

                variant.setVariantAttributes(variantAttributes);
        }

        private ProductVariant updateVariant(
                        ProductVariant variant,
                        UpdateVariantRequest request) {

                variant.setPrice(request.getPrice());
                variant.setStock(request.getStock());
                variant.setSku(generateSkuIfNeeded(request.getSku()));

                ProductVariant savedVariant = productVariantRepository.save(variant);

                rebuildVariantAttributes(
                                savedVariant,
                                request.getAttributes());

                return savedVariant;
        }

        private ProductVariant createVariant(
                        Product product,
                        UpdateVariantRequest request) {

                ProductVariant variant = ProductVariant.builder()
                                .product(product)
                                .price(request.getPrice())
                                .stock(request.getStock())
                                .sku(generateSkuIfNeeded(request.getSku()))
                                .build();

                ProductVariant savedVariant = productVariantRepository.save(variant);

                rebuildVariantAttributes(
                                savedVariant,
                                request.getAttributes());

                return savedVariant;
        }

        // Đồng bộ variant với DB
        private List<ProductVariant> syncVariants(
                        Product product,
                        List<UpdateVariantRequest> requests) {

                List<ProductVariant> currentVariants = productVariantRepository
                                .findAllByProductWithVariantAttributes(product);

                Map<Integer, ProductVariant> currentVariantMap = currentVariants.stream()
                                .collect(Collectors.toMap(
                                                ProductVariant::getVariantId,
                                                Function.identity()));

                List<ProductVariant> result = new ArrayList<>();

                Set<Integer> requestVariantIds = new HashSet<>();

                for (UpdateVariantRequest request : requests) {

                        // Update
                        if (request.getVariantId() != null) {

                                ProductVariant variant = currentVariantMap.get(request.getVariantId());

                                if (variant == null) {
                                        throw new RuntimeException("Variant not found.");
                                }

                                updateVariant(variant, request);

                                result.add(variant);

                                requestVariantIds.add(variant.getVariantId());

                        }
                        // Create
                        else {

                                ProductVariant variant = createVariant(product, request);

                                result.add(variant);
                        }
                }

                deleteRemovedVariants(
                                currentVariants,
                                requestVariantIds);

                return result;
        }

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

                List<ProductVariant> listVariantAndAtributes = productVariantRepository
                                .findAllByProductWithAttributes(product);
                // System.out.println("================================");
                // System.out.println("List Variant And Atributes");
                // for (ProductVariant variant : listVariantAndAtributes) {
                // System.out.println(variant.getVariantId());
                // System.out.println(variant.getVariantAttributes());
                // }
                // System.out.println("=====================================");

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
                                        ProductVariantResponse productVariantResponse = productVariantMapper
                                                        .toProductVariantResponse(p);
                                        productVariantResponse.setAttributes(
                                                        p.getVariantAttributes().stream().map(
                                                                        va -> {
                                                                                AttriubutesValueResponse attriubutesValueResponse = AttriubutesValueResponse
                                                                                                .builder()
                                                                                                .name(va.getAttrValue()
                                                                                                                .getAttribute()
                                                                                                                .getName())
                                                                                                .value(va.getAttrValue()
                                                                                                                .getValue())
                                                                                                .build();
                                                                                return attriubutesValueResponse;
                                                                        }).toList());
                                        return productVariantResponse;
                                }).toList()) //

                                .build();
        }

        @Override
        @Transactional(readOnly = true)
        public CompareProductResponse compareProducts(
                        Integer productId1,
                        Integer productId2) {

                if (productId1.equals(productId2)) {
                        throw new RuntimeException("Cannot compare the same product.");
                }

                Product product1 = productRepository.findById(productId1)
                                .orElseThrow(() -> new RuntimeException("Product not found."));

                Product product2 = productRepository.findById(productId2)
                                .orElseThrow(() -> new RuntimeException("Product not found."));

                if (!product1.getCategory().getCategoryId()
                                .equals(product2.getCategory().getCategoryId())) {

                        throw new RuntimeException("Products must belong to the same category.");
                }

                return CompareProductResponse.builder()
                                .products(List.of(
                                                buildCompareItem(product1),
                                                buildCompareItem(product2)))
                                .build();
        }

        @Override
        @Transactional(rollbackFor = Exception.class)
        public ProductDetailResponse createProduct(CreateProductRequest request, List<MultipartFile> images) {

                List<Path> savedFiles = new ArrayList<>();

                try {

                        validateCreateProduct(request, images);

                        Product product = saveProduct(request);

                        uploadProductImages(
                                        product,
                                        images,
                                        request.getThumbnailIndex(),
                                        savedFiles);

                        saveProductVariants(
                                        product,
                                        request.getVariants());
                        entityManager.flush();
                        entityManager.clear();

                        return getProductById(product.getProductId());

                } catch (Exception ex) {

                        cleanupUploadedFiles(savedFiles);
                        throw ex;
                }
        }

        @Override
        @Transactional
        public ProductDetailResponse updateProduct(
                        Integer productId,
                        UpdateProductRequest request,
                        List<MultipartFile> newImages) {

                List<Path> savedFiles = new ArrayList<>();

                try {

                        validateUpdateProduct(
                                        productId,
                                        request,
                                        newImages);

                        Product product = productRepository.findById(productId)
                                        .orElseThrow(() -> new RuntimeException("Product not found."));

                        Brand brand = brandRepository.findById(request.getBrandId())
                                        .orElseThrow(() -> new RuntimeException("Brand not found."));

                        Category category = categoryRepository.findById(request.getCategoryId())
                                        .orElseThrow(() -> new RuntimeException("Category not found."));

                        productMapper.updateProductFromRequest(request, product);

                        product.setName(request.getName().trim());
                        product.setBrand(brand);
                        product.setCategory(category);

                        productRepository.save(product);

                        syncProductImages(
                                        product,
                                        request.getExistingImages(),
                                        newImages,
                                        request.getThumbnail(),
                                        savedFiles);

                        syncVariants(
                                        product,
                                        request.getVariants());

                        entityManager.flush();
                        entityManager.clear();

                        return getProductById(productId);

                } catch (Exception ex) {

                        cleanupUploadedFiles(savedFiles);

                        throw ex;
                }
        }

}
