package com.trinhminhvi.techshop.dashboard.dto.request;

import com.trinhminhvi.techshop.dashboard.enums.DashboardPeriod;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RevenueRequest {

    @NotNull
    private DashboardPeriod type;

    private Integer year;

}