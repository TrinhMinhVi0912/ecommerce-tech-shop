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
@AllArgsConstructor
public class OrderStatisticsRequest {

    @NotNull
    @Builder.Default
    private DashboardPeriod type = DashboardPeriod.MONTH;

    @Builder.Default
    private Integer year = 2026;

}
