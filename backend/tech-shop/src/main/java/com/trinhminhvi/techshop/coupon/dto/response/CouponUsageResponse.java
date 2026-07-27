package com.trinhminhvi.techshop.coupon.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CouponUsageResponse {

    private Integer usageId;

    private String userId;

    private String username;

    private String email;

    private LocalDateTime usedAt;
}
