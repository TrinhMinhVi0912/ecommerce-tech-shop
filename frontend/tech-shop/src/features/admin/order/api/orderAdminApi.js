// src/features/admin/order/api/orderAdminApi.js
import axiosClient from "@/services/axiosClient";

const orderAdminApi = {

    // 📋 Lấy danh sách đơn hàng
    getOrders: (params) => {
        console.log('📋 [API] Getting orders with params:', params);
        return axiosClient.get("/admin/orders", { params });
    },

    // 🔍 Lấy chi tiết đơn hàng
    getOrderDetail: (orderId) => {
        console.log(`🔍 [API] Getting order detail: ${orderId}`);
        return axiosClient.get(`/admin/orders/${orderId}`);
    },

    // 🔄 Cập nhật trạng thái đơn hàng
    updateOrderStatus: (orderId, data) => {
        console.log(`🔄 [API] Updating order status: ${orderId}`, data);
        return axiosClient.patch(`/admin/orders/${orderId}/status`, data);
    }

};

export default orderAdminApi;