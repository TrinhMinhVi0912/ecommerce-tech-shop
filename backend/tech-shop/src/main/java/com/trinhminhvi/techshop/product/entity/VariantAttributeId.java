package com.trinhminhvi.techshop.product.entity;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class VariantAttributeId implements Serializable{
    
    @Column(name = "variant_id")
    private Integer variantId;

    @Column(name = "attr_value_id")
    private Integer attrValueId;
}
    