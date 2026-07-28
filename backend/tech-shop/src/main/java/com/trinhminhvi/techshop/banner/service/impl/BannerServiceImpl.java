package com.trinhminhvi.techshop.banner.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.trinhminhvi.techshop.banner.dto.request.GetAllBannerRequest;
import com.trinhminhvi.techshop.banner.dto.request.UpdateBannerStatusRequest;
import com.trinhminhvi.techshop.banner.dto.response.BannerResponse;
import com.trinhminhvi.techshop.banner.entity.Banner;
import com.trinhminhvi.techshop.banner.repository.BannerRepository;
import com.trinhminhvi.techshop.banner.service.BannerService;
import com.trinhminhvi.techshop.common.ImageExtension;
import com.trinhminhvi.techshop.common.PageableResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BannerServiceImpl implements BannerService {

    private static final String BANNER_UPLOAD_DIR = "backend/tech-shop/src/main/resources/static/images/banners";

    private final BannerRepository bannerRepository;

    // Helper dành cho xem tất cả banner admin

    private BannerResponse toBannerResponse(Banner banner) {

        return BannerResponse.builder()
                .bannerId(banner.getBannerId())
                .title(banner.getTitle())
                .imageUrl(banner.getImagePath())
                .isActive(banner.getIsActive())
                .createdAt(banner.getCreatedAt())
                .updatedAt(banner.getUpdatedAt())
                .build();
    }

    @Override
    @Transactional
    public BannerResponse createBanner(
            String title,
            MultipartFile image) {

        // Validate title
        if (title == null || title.isBlank()) {
            throw new RuntimeException("Title is required.");
        }

        if (bannerRepository.existsTitle(title)) {
            throw new RuntimeException("Banner title already exists.");
        }

        // Validate image
        if (image == null || image.isEmpty()) {
            throw new RuntimeException("Banner image is required.");
        }

        String originalFilename = image.getOriginalFilename();

        if (originalFilename == null || !originalFilename.contains(".")) {
            throw new RuntimeException("Invalid image.");
        }

        String extension = originalFilename.substring(
                originalFilename.lastIndexOf('.') + 1);

        if (!ImageExtension.isSupported(extension)) {
            throw new RuntimeException("Image format is not supported.");
        }

        try {

            String fileName = UUID.randomUUID() + "." + extension;

            Path uploadPath = Paths.get(BANNER_UPLOAD_DIR);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Files.copy(
                    image.getInputStream(),
                    uploadPath.resolve(fileName),
                    StandardCopyOption.REPLACE_EXISTING);

            String imagePath = "/images/banners/" + fileName;

            Banner banner = Banner.builder()
                    .title(title.trim())
                    .imagePath(imagePath)
                    .isActive(true)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            bannerRepository.save(banner);

            return BannerResponse.builder()
                    .bannerId(banner.getBannerId())
                    .title(banner.getTitle())
                    .imageUrl(banner.getImagePath())
                    .isActive(banner.getIsActive())
                    .createdAt(banner.getCreatedAt())
                    .updatedAt(banner.getUpdatedAt())
                    .build();

        } catch (IOException e) {
            throw new RuntimeException("Upload banner image failed.");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public PageableResponse<List<BannerResponse>> getAllBanner(
            GetAllBannerRequest request) {

        Sort sort = request.getSortDir().equalsIgnoreCase("asc")
                ? Sort.by(request.getSortBy()).ascending()
                : Sort.by(request.getSortBy()).descending();

        Pageable pageable = PageRequest.of(
                request.getPageNum() - 1,
                request.getPageSize(),
                sort);

        Page<Banner> page = bannerRepository.searchBanner(
                request.getSearch(),
                pageable);

        List<BannerResponse> responses = page.getContent()
                .stream()
                .map(this::toBannerResponse)
                .toList();

        return PageableResponse.<List<BannerResponse>>builder()
                .pageNum(page.getNumber() + 1)
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .items(responses)
                .build();
    }

    @Override
    @Transactional
    public BannerResponse updateBannerStatus(
            Integer bannerId,
            UpdateBannerStatusRequest request) {

        Banner banner = bannerRepository.findById(bannerId)
                .orElseThrow(() -> new RuntimeException("Banner not found."));

        banner.setIsActive(request.getActive());
        banner.setUpdatedAt(LocalDateTime.now());

        bannerRepository.save(banner);

        return BannerResponse.builder()
                .bannerId(banner.getBannerId())
                .title(banner.getTitle())
                .imageUrl(banner.getImagePath())
                .isActive(banner.getIsActive())
                .createdAt(banner.getCreatedAt())
                .updatedAt(banner.getUpdatedAt())
                .build();
    }

    @Override
    @Transactional
    public void deleteBanner(Integer bannerId) {

        Banner banner = bannerRepository.findById(bannerId)
                .orElseThrow(() -> new RuntimeException("Banner not found."));

        // Xóa file ảnh
        if (banner.getImagePath() != null && !banner.getImagePath().isBlank()) {

            try {

                String fileName = Paths.get(banner.getImagePath())
                        .getFileName()
                        .toString();

                Path imagePath = Paths.get(BANNER_UPLOAD_DIR, fileName);

                Files.deleteIfExists(imagePath);

            } catch (IOException e) {
                throw new RuntimeException("Delete banner image failed.");
            }
        }

        bannerRepository.delete(banner);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BannerResponse> getActiveBanner() {

        return bannerRepository.findByIsActiveTrueOrderByCreatedAtDesc()
                .stream()
                .map(this::toBannerResponse)
                .toList();
    }

}