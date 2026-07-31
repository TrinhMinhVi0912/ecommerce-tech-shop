import { Link } from "react-router-dom";

export default function ProductInfo({ name, description, brand, category }) {
    return (
        <div className="space-y-4">
            {/* Breadcrumb */}
            <nav className="text-sm text-slate-500">
                <span>Trang chủ</span>
                <span className="mx-2">/</span>
                <Link to="/products" className="hover:text-blue-600">Sản phẩm</Link>
                {category && (
                    <>
                        <span className="mx-2">/</span>
                        <Link
                            to={`/products?categoryId=${category.parentId || category.categoryId}`}
                            className="hover:text-blue-600"
                        >
                            {category.parentName || category.name}
                        </Link>
                        {category.parentId && (
                            <>
                                <span className="mx-2">/</span>
                                <Link
                                    to={`/products?categoryId=${category.categoryId}`}
                                    className="hover:text-blue-600"
                                >
                                    {category.name}
                                </Link>
                            </>
                        )}
                    </>
                )}
            </nav>

            {/* Name */}
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                {name}
            </h1>

            {/* Brand */}
            {brand && (
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-500">Thương hiệu:</span>
                    <Link
                        to={`/products?brandId=${brand.brandId}`}
                        className="text-blue-600 hover:underline font-medium"
                    >
                        {brand.name}
                    </Link>
                </div>
            )}

            {/* Short Description */}
            <p className="text-slate-600 text-sm leading-relaxed">
                {description}
            </p>
        </div>
    );
}