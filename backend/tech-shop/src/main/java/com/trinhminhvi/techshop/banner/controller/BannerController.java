package com.trinhminhvi.techshop.banner.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.trinhminhvi.techshop.banner.dto.request.GetAllBannerRequest;
import com.trinhminhvi.techshop.banner.dto.request.UpdateBannerStatusRequest;
import com.trinhminhvi.techshop.banner.dto.response.BannerResponse;
import com.trinhminhvi.techshop.banner.service.BannerService;
import com.trinhminhvi.techshop.common.ApiResponse;
import com.trinhminhvi.techshop.common.PageableResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/banners")
@CrossOrigin("*")
@RequiredArgsConstructor
public class BannerController {

    private final BannerService bannerService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<BannerResponse> createBanner(

            @RequestParam("title") String title,

            @RequestParam("image") MultipartFile image) {

        return ApiResponse.success(
                bannerService.createBanner(title, image),
                "Create banner successfully");
    }

    @GetMapping
    public ApiResponse<PageableResponse<List<BannerResponse>>> getAllBanner(
            @ModelAttribute GetAllBannerRequest request) {

        return ApiResponse.success(
                bannerService.getAllBanner(request),
                "Get banners successfully");
    }

    @PatchMapping("/{bannerId}/active")
    public ApiResponse<BannerResponse> updateBannerStatus(

            @PathVariable Integer bannerId,

            @RequestBody UpdateBannerStatusRequest request) {

        return ApiResponse.success(
                bannerService.updateBannerStatus(
                        bannerId,
                        request),
                "Update banner status successfully");
    }

    @DeleteMapping("/{bannerId}")
    public ApiResponse<Object> deleteBanner(
            @PathVariable Integer bannerId) {

        bannerService.deleteBanner(bannerId);

        return ApiResponse.builder()
                .success(true)
                .message("Delete banner successfully")
                .data(null)
                .build();
    }

}
