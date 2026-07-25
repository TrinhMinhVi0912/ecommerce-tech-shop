package com.trinhminhvi.techshop.payment.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "vnpay")
public class VNPayConfig {

    //Terminal ID
    private String tmnCode;

    //Secret Key
    private String hashSecret;

    //URL thanh toán
    private String payUrl;

    // URL VNPAY redirect về sau khi thanh toán
    private String returnUrl;

    //URL IPN
    private String ipnUrl;
}
