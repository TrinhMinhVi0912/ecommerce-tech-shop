package com.trinhminhvi.techshop.coupon.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
import com.trinhminhvi.techshop.coupon.entity.Coupon;
import com.trinhminhvi.techshop.coupon.entity.CouponUsage;
import com.trinhminhvi.techshop.coupon.enums.DiscountType;
import com.trinhminhvi.techshop.coupon.mapper.CouponMapper;
import com.trinhminhvi.techshop.coupon.repository.CouponRepository;
import com.trinhminhvi.techshop.coupon.repository.CouponUsageRepository;
import com.trinhminhvi.techshop.coupon.service.CouponService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CouponServiceImpl implements CouponService {

    private final CouponRepository couponRepository;
    private final CouponUsageRepository couponUsageRepository;
    private final CouponMapper couponMapper;

    // Helper dành cho tạo coupon chủ yếu là validation

    private void validateCouponCode(
            Integer couponId,
            String code) {

        if (code == null || code.isBlank()) {
            throw new RuntimeException("Coupon code cannot be blank.");
        }

        String normalizedCode = code.trim().toUpperCase();

        boolean exists;

        if (couponId == null) {
            exists = couponRepository.existsByCode(normalizedCode);
        } else {
            exists = couponRepository.existsByCodeAndCouponIdNot(
                    normalizedCode,
                    couponId);
        }

        if (exists) {
            throw new RuntimeException("Coupon code already exists.");
        }
    }

    private void validateDiscount(
            DiscountType discountType,
            BigDecimal discount,
            BigDecimal maximumDiscount) {

        if (discount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException(
                    "Discount must be greater than zero.");
        }

        if (discountType == DiscountType.PERCENT) {

            if (discount.compareTo(BigDecimal.valueOf(100)) > 0) {
                throw new RuntimeException(
                        "Percentage discount cannot exceed 100%.");
            }

            if (maximumDiscount == null
                    || maximumDiscount.compareTo(BigDecimal.ZERO) <= 0) {

                throw new RuntimeException(
                        "Maximum discount is required for percentage coupons.");
            }

        } else {

            if (maximumDiscount != null) {
                throw new RuntimeException(
                        "Maximum discount must be null for fixed discount coupons.");
            }
        }
    }

    private void validateQuantity(Integer quantity) {

        if (quantity == null || quantity <= 0) {
            throw new RuntimeException(
                    "Coupon quantity must be greater than zero.");
        }
    }

    private void validateMinimumOrder(BigDecimal minimumOrder) {

        if (minimumOrder == null
                || minimumOrder.compareTo(BigDecimal.ZERO) < 0) {

            throw new RuntimeException(
                    "Minimum order cannot be negative.");
        }
    }

    private void validateDate(
            LocalDateTime startDate,
            LocalDateTime expireDate) {

        if (startDate == null) {
            throw new RuntimeException("Start date is required.");
        }

        if (expireDate == null) {
            throw new RuntimeException("Expire date is required.");
        }

        if (!startDate.isBefore(expireDate)) {
            throw new RuntimeException(
                    "Expire date must be after start date.");
        }
    }

    private void validateCreateCoupon(
            CreateCouponRequest request) {

        validateCouponCode(
                null,
                request.getCode());

        validateDiscount(
                request.getDiscountType(),
                request.getDiscount(),
                request.getMaximumDiscount());

        validateQuantity(request.getQuantity());

        validateMinimumOrder(request.getMinimumOrder());

        validateDate(
                request.getStartDate(),
                request.getExpireDate());
    }

    // Helper dành cho update coupon
    private void validateUpdateCoupon(
            Integer couponId,
            UpdateCouponRequest request) {

        validateCouponCode(
                couponId,
                request.getCode());

        validateDiscount(
                request.getDiscountType(),
                request.getDiscount(),
                request.getMaximumDiscount());

        validateQuantity(request.getQuantity());

        validateMinimumOrder(request.getMinimumOrder());

        validateDate(
                request.getStartDate(),
                request.getExpireDate());
    }

    @Override
    @Transactional
    public CreateCouponResponse createCoupon(CreateCouponRequest request) {

        validateCreateCoupon(request);

        Coupon coupon = couponMapper.toCoupon(request);

        coupon.setName(request.getName().trim());

        coupon.setCode(request.getCode().trim().toUpperCase());

        coupon.setDescription(
                request.getDescription() == null
                        ? null
                        : request.getDescription().trim());

        if (coupon.getActive() == null) {
            coupon.setActive(true);
        }

        coupon.setCreatedAt(LocalDateTime.now());

        coupon.setUpdatedAt(LocalDateTime.now());

        Coupon savedCoupon = couponRepository.save(coupon);

        return couponMapper.toCreateCouponResponse(savedCoupon);
    }

    @Override
    @Transactional
    public CouponDetailResponse updateCoupon(
            Integer couponId,
            UpdateCouponRequest request) {

        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new RuntimeException("Coupon not found."));

        validateUpdateCoupon(couponId, request);

        couponMapper.updateCouponFromRequest(request, coupon);

        coupon.setName(request.getName().trim());

        coupon.setCode(request.getCode().trim().toUpperCase());

        coupon.setDescription(
                request.getDescription() == null
                        ? null
                        : request.getDescription().trim());

        coupon.setUpdatedAt(LocalDateTime.now());

        Coupon savedCoupon = couponRepository.save(coupon);

        return couponMapper.toCouponDetailResponse(savedCoupon);
    }

    @Override
    @Transactional(readOnly = true)
    public CouponDetailResponse getCouponById(Integer couponId) {

        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new RuntimeException("Coupon not found."));

        return couponMapper.toCouponDetailResponse(coupon);
    }

    @Override
    @Transactional(readOnly = true)
    public PageableResponse<List<CouponResponse>> getAllCoupons(
            Pageable pageable,
            GetCouponsRequest request) {

        Page<Coupon> pageCoupons = couponRepository.searchCoupons(
                request.getSearch(),
                request.getActive(),
                pageable);

        List<CouponResponse> responses = pageCoupons.getContent()
                .stream()
                .map(coupon -> {

                    CouponResponse response = couponMapper.toCouponResponse(coupon);

                    response.setTotalUsage(
                            couponUsageRepository.countUsage(coupon.getCouponId()));

                    return response;
                })
                .toList();

        return PageableResponse.<List<CouponResponse>>builder()
                .pageNum(request.getPageNum())
                .pageSize(request.getPageSize())
                .totalElements(pageCoupons.getTotalElements())
                .totalPages(pageCoupons.getTotalPages())
                .items(responses)
                .build();
    }

    @Override
    @Transactional
    public CouponDetailResponse updateCouponStatus(
            Integer couponId,
            UpdateCouponStatusRequest request) {

        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new RuntimeException("Coupon not found."));

        coupon.setActive(request.getActive());

        coupon.setUpdatedAt(LocalDateTime.now());

        Coupon savedCoupon = couponRepository.save(coupon);

        return couponMapper.toCouponDetailResponse(savedCoupon);
    }

    @Override
    @Transactional(readOnly = true)
    public PageableResponse<List<CouponUsageResponse>> getCouponUsages(
            Integer couponId,
            Pageable pageable,
            GetCouponUsageRequest request) {

        if (!couponRepository.existsById(couponId)) {
            throw new RuntimeException("Coupon not found.");
        }

        Page<CouponUsage> pageCouponUsage = couponUsageRepository.findCouponUsages(
                couponId,
                request.getSearch(),
                pageable);

        List<CouponUsageResponse> responses = pageCouponUsage.getContent()
                .stream()
                .map(usage -> CouponUsageResponse.builder()
                        .usageId(usage.getUsageId())
                        .userId(usage.getUser().getUserId())
                        .username(usage.getUser().getUserName()) // sửa ở đây
                        .email(usage.getUser().getEmail())
                        .usedAt(usage.getUsedAt())
                        .build())
                .toList();

        return PageableResponse.<List<CouponUsageResponse>>builder()
                .pageNum(request.getPageNum())
                .pageSize(request.getPageSize())
                .totalElements(pageCouponUsage.getTotalElements())
                .totalPages(pageCouponUsage.getTotalPages())
                .items(responses)
                .build();
    }

}
