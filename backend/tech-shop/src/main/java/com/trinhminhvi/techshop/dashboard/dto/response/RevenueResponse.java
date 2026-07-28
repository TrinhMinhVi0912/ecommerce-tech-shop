package com.trinhminhvi.techshop.dashboard.dto.response;

import java.math.BigDecimal;
import java.util.List;

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
public class RevenueResponse {

    private BigDecimal totalRevenue;

    private List<RevenueItemResponse> items;

}
