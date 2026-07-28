package com.trinhminhvi.techshop.dashboard.dto.response;

import java.math.BigDecimal;

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
public class DashboardSummaryResponse {

    private Long totalEnableUsers;

    private Long totalActiveProducts;

    private Long totalCompleteOrders;

    private BigDecimal totalRevenue;

}
