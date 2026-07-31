import React from "react";
import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

export default function ProductPagination({
    pageNum = 1,
    totalPages = 1,
    onPageChange,
}) {

    if (totalPages <= 1) return null;

    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    return (

        <div className="flex justify-center items-center gap-2 mt-8">

            {/* Previous */}

            <button
                disabled={pageNum === 1}
                onClick={() => onPageChange(pageNum - 1)}
                className="
                    w-10
                    h-10
                    rounded-lg
                    border
                    border-slate-300
                    flex
                    items-center
                    justify-center
                    disabled:opacity-40
                    hover:bg-slate-100
                    transition
                "
            >
                <ChevronLeft size={18} />
            </button>

            {/* Pages */}

            {
                pages.map(page => (

                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`
                            w-10
                            h-10
                            rounded-lg
                            border
                            transition
                            ${page === pageNum
                                ? "bg-blue-600 border-blue-600 text-white"
                                : "border-slate-300 hover:bg-slate-100"}
                        `}
                    >
                        {page}
                    </button>

                ))
            }

            {/* Next */}

            <button
                disabled={pageNum === totalPages}
                onClick={() => onPageChange(pageNum + 1)}
                className="
                    w-10
                    h-10
                    rounded-lg
                    border
                    border-slate-300
                    flex
                    items-center
                    justify-center
                    disabled:opacity-40
                    hover:bg-slate-100
                    transition
                "
            >
                <ChevronRight size={18} />
            </button>

        </div>

    );

}