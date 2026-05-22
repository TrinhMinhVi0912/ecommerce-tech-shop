package com.trinhminhvi.techshop.entity;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "variant_attributes")
public class VariantAttribute {

    @EmbeddedId
    private VariantAttributeId id;

    @ManyToOne
    @MapsId("variantId")
    @JoinColumn(name = "variant_id")
    private ProductVariant variant;

    @ManyToOne
    @MapsId("attrValueId")
    @JoinColumn(name = "attr_value_id")
    private AttributeValue attrValue;
}

// khi insert dữ liệu VD:

// VariantAttribute variantAttribute = VariantAttribute.builder()
//         .id(new VariantAttributeId(1, 2))
//         .productVariant(productVariant)
//         .attributeValue(attributeValue)
//         .build();