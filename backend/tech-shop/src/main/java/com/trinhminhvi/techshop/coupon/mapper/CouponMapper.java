package com.trinhminhvi.techshop.coupon.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.trinhminhvi.techshop.coupon.dto.request.CreateCouponRequest;
import com.trinhminhvi.techshop.coupon.dto.request.UpdateCouponRequest;
import com.trinhminhvi.techshop.coupon.dto.response.CouponDetailResponse;
import com.trinhminhvi.techshop.coupon.dto.response.CouponResponse;
import com.trinhminhvi.techshop.coupon.dto.response.CreateCouponResponse;
import com.trinhminhvi.techshop.coupon.entity.Coupon;

@Mapper(componentModel = "spring")
public interface CouponMapper {

    Coupon toCoupon(CreateCouponRequest request);

    CreateCouponResponse toCreateCouponResponse(Coupon coupon);

    CouponDetailResponse toCouponDetailResponse(Coupon coupon);

    CouponResponse toCouponResponse(Coupon coupon);

    void updateCouponFromRequest(
            UpdateCouponRequest request,
            @MappingTarget Coupon coupon);

}
