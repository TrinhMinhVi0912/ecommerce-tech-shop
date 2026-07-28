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
public class TopProductResponse {

    private Integer productId;

    private String productName;

    private String thumbnail;

    private String brandName;

    private String categoryName;

    private Long totalSold;

    private BigDecimal revenue;

}
