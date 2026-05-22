package com.trinhminhvi.techshop.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.Getter;

@Getter
@Component
public class AppProperties {
    @Value("${app.baseurl}")
    private String baseUrl;
}
