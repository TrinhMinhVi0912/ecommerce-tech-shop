package com.trinhminhvi.techshop.controller;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.trinhminhvi.techshop.dto.response.ApiResponse;
import com.trinhminhvi.techshop.dto.response.ProductResponse;
import com.trinhminhvi.techshop.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/product")
@CrossOrigin("*")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ApiResponse<List<ProductResponse>> getAllProduct(
        @RequestParam(required = false,defaultValue = "5") Integer pageSize,
        @RequestParam(required = false,defaultValue = "1") Integer pageNum
    ) {
        return ApiResponse.<List<ProductResponse>>builder()
                .success(true)
                .message("Get Products Successfully")
                .data(productService.getAllProduct(PageRequest.of(pageNum-1,pageSize)))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<ProductResponse> getProductById(@PathVariable Integer id) {
        return ApiResponse.<ProductResponse>builder()
        .success(true)
        .message("Get Detail Product Successfully")
        .data(productService.getProductById(id))
        .build();
    }
    

}
