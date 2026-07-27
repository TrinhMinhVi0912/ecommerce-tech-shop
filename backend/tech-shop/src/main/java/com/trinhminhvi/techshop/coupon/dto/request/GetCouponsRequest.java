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
public class GetCouponsRequest {

    @Builder.Default
    private Integer pageNum = 1;

    @Builder.Default
    private Integer pageSize = 10;

    @Builder.Default
    private String sortBy = "couponId";

    @Builder.Default
    private String sortDir = "ASC";

    /**
     * Tìm theo name hoặc code
     */
    private String search;

    /**
     * null = tất cả
     * true = đang active
     * false = đã inactive
     */
    private Boolean active;

}
