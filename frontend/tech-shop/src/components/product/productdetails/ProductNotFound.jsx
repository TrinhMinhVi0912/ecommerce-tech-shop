import { Link } from "react-router-dom";
import { PackageX, ArrowLeft } from "lucide-react";

export default function ProductNotFound() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-md mx-auto text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                        <PackageX size={48} className="text-gray-400" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Không tìm thấy sản phẩm
                </h2>
                <p className="text-gray-500 mb-6">
                    Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
                </p>
                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                    <ArrowLeft size={18} />
                    Quay lại danh sách sản phẩm
                </Link>
            </div>
        </div>
    );
}