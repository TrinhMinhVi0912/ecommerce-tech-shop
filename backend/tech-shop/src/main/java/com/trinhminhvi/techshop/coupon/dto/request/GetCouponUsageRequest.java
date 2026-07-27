package com.trinhminhvi.techshop.coupon.dto.request;

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
public class GetCouponUsageRequest {

    @Builder.Default
    private Integer pageNum = 1;

    @Builder.Default
    private Integer pageSize = 10;

    @Builder.Default
    private String sortBy = "usedAt";

    @Builder.Default
    private String sortDir = "DESC";

    /**
     * Tìm theo username hoặc email
     */
    private String search;
}
