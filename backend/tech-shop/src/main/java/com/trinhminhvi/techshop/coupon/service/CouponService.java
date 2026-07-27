package com.trinhminhvi.techshop.coupon.service;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.trinhminhvi.techshop.common.PageableResponse;
import com.trinhminhvi.techshop.coupon.dto.request.CreateCouponRequest;
import com.trinhminhvi.techshop.coupon.dto.request.GetCouponsRequest;
import com.trinhminhvi.techshop.coupon.dto.request.UpdateCouponRequest;
import com.trinhminhvi.techshop.coupon.dto.request.UpdateCouponStatusRequest;
import com.trinhminhvi.techshop.coupon.dto.response.CouponDetailResponse;
import com.trinhminhvi.techshop.coupon.dto.response.CouponResponse;
import com.trinhminhvi.techshop.coupon.dto.response.CreateCouponResponse;

public interface CouponService {

    public CreateCouponResponse createCoupon(CreateCouponRequest request);

    public CouponDetailResponse updateCoupon(Integer couponId, UpdateCouponRequest request);

    public CouponDetailResponse getCouponById(Integer couponId);

    public PageableResponse<List<CouponResponse>> getAllCoupons(Pageable pageable, GetCouponsRequest request);

    CouponDetailResponse updateCouponStatus(Integer couponId, UpdateCouponStatusRequest request);

}
