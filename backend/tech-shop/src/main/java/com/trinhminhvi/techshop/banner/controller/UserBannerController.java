package com.trinhminhvi.techshop.banner.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trinhminhvi.techshop.banner.dto.response.BannerResponse;
import com.trinhminhvi.techshop.banner.service.BannerService;
import com.trinhminhvi.techshop.common.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/banners")
@RequiredArgsConstructor
@CrossOrigin("*")
public class UserBannerController {

    private final BannerService bannerService;

    @GetMapping
    public ApiResponse<List<BannerResponse>> getActiveBanner() {

        return ApiResponse.success(
                bannerService.getActiveBanner(),
                "Get banners successfully");
    }
}
