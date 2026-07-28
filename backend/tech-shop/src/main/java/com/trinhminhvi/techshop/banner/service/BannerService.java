package com.trinhminhvi.techshop.banner.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import com.trinhminhvi.techshop.banner.dto.request.GetAllBannerRequest;
import com.trinhminhvi.techshop.banner.dto.request.UpdateBannerStatusRequest;
import com.trinhminhvi.techshop.banner.dto.response.BannerResponse;
import com.trinhminhvi.techshop.common.PageableResponse;

public interface BannerService {

    BannerResponse createBanner(String title, MultipartFile image);

    PageableResponse<List<BannerResponse>> getAllBanner(GetAllBannerRequest request);

    BannerResponse updateBannerStatus(Integer bannerId, UpdateBannerStatusRequest request);

    void deleteBanner(Integer bannerId);

    public List<BannerResponse> getActiveBanner();

}