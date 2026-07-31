import { useState } from "react";

export default function ProductVariants({ variants = [] }) {
    const [selectedVariant, setSelectedVariant] = useState(variants[0] || null);

    // Group attributes by name
    const attributeGroups = {};
    variants.forEach(variant => {
        variant.attributes?.forEach(attr => {
            if (!attributeGroups[attr.name]) {
                attributeGroups[attr.name] = [];
            }
            if (!attributeGroups[attr.name].includes(attr.value)) {
                attributeGroups[attr.name].push(attr.value);
            }
        });
    });

    // Find variant for selected attributes
    const findVariant = (selectedAttrs) => {
        return variants.find(v =>
            v.attributes?.every(attr =>
                selectedAttrs[attr.name] === attr.value
            )
        );
    };

    const handleAttributeSelect = (attrName, value) => {
        const newSelected = { ...selectedAttributes, [attrName]: value };
        setSelectedAttributes(newSelected);
        const variant = findVariant(newSelected);
        if (variant) {
            setSelectedVariant(variant);
        }
    };

    // Build selected attributes from initial variant
    const initialSelected = {};
    variants[0]?.attributes?.forEach(attr => {
        initialSelected[attr.name] = attr.value;
    });
    const [selectedAttributes, setSelectedAttributes] = useState(initialSelected);

    if (variants.length === 0) return null;

    return (
        <div className="space-y-4">
            {Object.entries(attributeGroups).map(([name, values]) => (
                <div key={name}>
                    <label className="text-sm font-medium text-slate-700">
                        {name}:
                    </label>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {values.map(value => (
                            <button
                                key={value}
                                onClick={() => handleAttributeSelect(name, value)}
                                className={`px-4 py-2 text-sm rounded-lg border transition ${selectedAttributes[name] === value
                                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                                    }`}
                            >
                                {value}
                            </button>
                        ))}
                    </div>
                </div>
            ))}

            {selectedVariant && (
                <div className="flex items-center gap-4 text-sm bg-slate-50 p-3 rounded-lg">
                    <span className="text-slate-500">Mã SKU:</span>
                    <span className="font-medium">{selectedVariant.sku}</span>
                    <span className="text-slate-300">|</span>
                    <span className="text-slate-500">Tồn kho:</span>
                    <span className={`font-medium ${selectedVariant.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedVariant.stock > 0 ? `${selectedVariant.stock} sản phẩm` : 'Hết hàng'}
                    </span>
                </div>
            )}
        </div>
    );
}