package com.trinhminhvi.techshop.coupon.controller;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trinhminhvi.techshop.common.ApiResponse;
import com.trinhminhvi.techshop.common.PageableResponse;
import com.trinhminhvi.techshop.coupon.dto.request.CreateCouponRequest;
import com.trinhminhvi.techshop.coupon.dto.request.GetCouponUsageRequest;
import com.trinhminhvi.techshop.coupon.dto.request.GetCouponsRequest;
import com.trinhminhvi.techshop.coupon.dto.request.UpdateCouponRequest;
import com.trinhminhvi.techshop.coupon.dto.request.UpdateCouponStatusRequest;
import com.trinhminhvi.techshop.coupon.dto.response.CouponDetailResponse;
import com.trinhminhvi.techshop.coupon.dto.response.CouponResponse;
import com.trinhminhvi.techshop.coupon.dto.response.CouponUsageResponse;
import com.trinhminhvi.techshop.coupon.dto.response.CreateCouponResponse;
import com.trinhminhvi.techshop.coupon.service.CouponService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/coupons")
@CrossOrigin("*")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    @PostMapping
    public ApiResponse<CreateCouponResponse> createCoupon(
            @RequestBody @Validated CreateCouponRequest request) {

        return ApiResponse.success(
                couponService.createCoupon(request),
                "Create Coupon Successfully");
    }

    @PutMapping("/{id}")
    public ApiResponse<CouponDetailResponse> updateCoupon(
            @PathVariable Integer id,
            @RequestBody @Validated UpdateCouponRequest request) {

        return ApiResponse.success(
                couponService.updateCoupon(id, request),
                "Update Coupon Successfully");
    }

    @GetMapping("/{id}")
    public ApiResponse<CouponDetailResponse> getCouponById(
            @PathVariable Integer id) {

        return ApiResponse.success(
                couponService.getCouponById(id),
                "Get Coupon Successfully");
    }

    @GetMapping
    public ApiResponse<PageableResponse<List<CouponResponse>>> getAllCoupons(
            GetCouponsRequest request) {

        Sort sort = request.getSortDir().equalsIgnoreCase("ASC")
                ? Sort.by(request.getSortBy()).ascending()
                : Sort.by(request.getSortBy()).descending();

        return ApiResponse.success(
                couponService.getAllCoupons(
                        PageRequest.of(
                                request.getPageNum() - 1,
                                request.getPageSize(),
                                sort),
                        request),
                "Get Coupons Successfully");
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<CouponDetailResponse> updateCouponStatus(
            @PathVariable Integer id,
            @RequestBody @Validated UpdateCouponStatusRequest request) {

        return ApiResponse.success(
                couponService.updateCouponStatus(id, request),
                "Update Coupon Status Successfully");
    }

    @GetMapping("/{id}/usages")
    public ApiResponse<PageableResponse<List<CouponUsageResponse>>> getCouponUsages(
            @PathVariable Integer id,
            GetCouponUsageRequest request) {

        Sort sort = request.getSortDir().equalsIgnoreCase("ASC")
                ? Sort.by(request.getSortBy()).ascending()
                : Sort.by(request.getSortBy()).descending();

        return ApiResponse.success(
                couponService.getCouponUsages(
                        id,
                        PageRequest.of(
                                request.getPageNum() - 1,
                                request.getPageSize(),
                                sort),
                        request),
                "Get Coupon Usages Successfully");
    }

}