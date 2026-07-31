import { useEffect, useState } from "react";
import productApi from "../api/productApi";

export default function useProducts(filters = {}, categories = []) {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /*
    Lấy toàn bộ category con
    */

    const getCategoryAndChildrenIds = (parentId) => {

        if (!parentId) return [];

        const ids = [parentId];

        const findChildren = (id) => {

            categories
                .filter(category => category.parentId === id)
                .forEach(category => {

                    ids.push(category.categoryId);

                    findChildren(category.categoryId);

                });

        };

        findChildren(parentId);

        return ids;

    };

    useEffect(() => {

        const fetchProducts = async () => {

            try {

                setLoading(true);

                /*
                Không chọn category
                */

                if (!filters.categoryId) {

                    const response = await productApi.getAll(filters);

                    setData(response.data);

                    return;

                }

                /*
                Có chọn category
                */

                const ids = getCategoryAndChildrenIds(filters.categoryId);

                /*
                Chỉ có 1 category
                */

                if (ids.length === 1) {

                    const response = await productApi.getAll(filters);

                    setData(response.data);

                    return;

                }

                /*
                Category cha -> gọi nhiều request
                */

                const responses = await Promise.all(

                    ids.map(id =>

                        productApi.getAll({

                            ...filters,
                            categoryId: id,

                        })

                    )

                );

                /*
                Gộp sản phẩm
                */

                const mergedProducts = responses.flatMap(
                    response => response.data.data.items
                );

                /*
                Loại bỏ sản phẩm trùng
                */

                const uniqueProducts = Array.from(

                    new Map(

                        mergedProducts.map(product => [

                            product.productId,
                            product

                        ])

                    ).values()

                );

                /*
                Tổng số sản phẩm
                */

                setData({

                    success: true,

                    message: "Get Products Successfully",

                    data: {

                        pageNum: filters.pageNum,

                        pageSize: filters.pageSize,

                        totalElements: uniqueProducts.length,

                        totalPages: Math.ceil(
                            uniqueProducts.length / filters.pageSize
                        ),

                        items: uniqueProducts,

                    }

                });

            } catch (err) {

                console.error(err);

                setError(err);

            } finally {

                setLoading(false);

            }

        };

        fetchProducts();

    }, [filters, categories]);

    return {

        data,
        loading,
        error,

    };

}