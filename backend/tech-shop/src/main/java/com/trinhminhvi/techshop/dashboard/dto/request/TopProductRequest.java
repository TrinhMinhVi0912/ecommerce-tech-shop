package com.trinhminhvi.techshop.dashboard.dto.request;

import com.trinhminhvi.techshop.dashboard.enums.DashboardPeriod;

import jakarta.validation.constraints.NotNull;
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
public class TopProductRequest {

    @NotNull(message = "Dashboard type is required")
    private DashboardPeriod type;

    /**
     * Bắt buộc với MONTH, QUARTER, YEAR
     * Không dùng nếu sau này bổ sung CUSTOM RANGE
     */
    @Builder.Default
    private Integer year = 2026;

    /**
     * Chỉ dùng khi type = MONTH
     * Giá trị: 1 - 12
     */
    @Builder.Default
    private Integer month = 1;

    /**
     * Chỉ dùng khi type = QUARTER
     * Giá trị: 1 - 4
     */
    @Builder.Default
    private Integer quarter = 1;

}
