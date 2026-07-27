package com.trinhminhvi.techshop.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PageableResponse <T>{
    private Integer pageNum;
    private Integer pageSize;
    private Long totalElements;
    private Integer totalPages;
    private T items;
} 