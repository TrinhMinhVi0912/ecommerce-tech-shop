package com.trinhminhvi.techshop.user.dto.request;

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
public class GetUsersRequest {

    @Builder.Default
    private Integer pageNum = 1;

    @Builder.Default
    private Integer pageSize = 10;

    @Builder.Default
    private String sortBy = "createdAt";

    @Builder.Default
    private String sortDir = "DESC";

    /**
     * Search by username, email or phone
     */
    private String search;
}
