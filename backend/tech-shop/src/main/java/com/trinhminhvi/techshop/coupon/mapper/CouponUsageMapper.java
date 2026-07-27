package com.trinhminhvi.techshop.coupon.mapper;

import org.mapstruct.Mapper;

import com.trinhminhvi.techshop.coupon.dto.response.CouponUsageResponse;
import com.trinhminhvi.techshop.coupon.entity.CouponUsage;

@Mapper(componentModel = "spring")
public interface CouponUsageMapper {

    CouponUsageResponse toCouponUsageResponse(CouponUsage couponUsage);

}
