package com.trinhminhvi.techshop.order.dto.request;

import java.util.List;

import com.trinhminhvi.techshop.order.enums.PaymentMethod;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckoutRequest {

    @NotEmpty(message = "Cart items cannot be empty")
    private List<Integer> cartItemIds;

    @NotNull(message = "Please specify address type")
    private Boolean useSavedAddress;

    // Chỉ dùng khi useSavedAddress = true
    private Integer addressId;

    //Chỉ dùng khi useSavedAddress = false
    private NewAddressRequest newAddress;

    
    //Chỉ có ý nghĩa khi nhập địa chỉ mới
    private Boolean saveNewAddress;

    private String receiverName;

    private String receiverPhone;

    private String couponCode;

    @NotNull
    private PaymentMethod paymentMethod;

    private String note;

}