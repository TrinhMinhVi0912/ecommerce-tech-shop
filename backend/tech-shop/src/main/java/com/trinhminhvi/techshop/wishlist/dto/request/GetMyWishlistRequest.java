package com.trinhminhvi.techshop.wishlist.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetMyWishlistRequest {

    private Integer pageNum = 1;

    private Integer pageSize = 10;

    // private String sortBy = "name";

    private String sortDir = "asc";
}
