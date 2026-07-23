package com.trinhminhvi.techshop.order.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import com.trinhminhvi.techshop.cart.entity.Cart;
import com.trinhminhvi.techshop.cart.entity.CartItem;
import com.trinhminhvi.techshop.cart.repository.CartItemRepository;
import com.trinhminhvi.techshop.cart.repository.CartRepository;
import com.trinhminhvi.techshop.common.PageableResponse;
import com.trinhminhvi.techshop.order.dto.internal.CheckoutAddress;
import com.trinhminhvi.techshop.order.dto.internal.PriceSummary;
import com.trinhminhvi.techshop.order.dto.request.CheckoutRequest;
import com.trinhminhvi.techshop.order.dto.request.GetMyOrdersRequest;
import com.trinhminhvi.techshop.order.dto.request.NewAddressRequest;
import com.trinhminhvi.techshop.order.dto.request.OrderSummaryResponse;
import com.trinhminhvi.techshop.order.dto.response.CheckoutResponse;
import com.trinhminhvi.techshop.order.dto.response.OrderDetailResponse;
import com.trinhminhvi.techshop.order.dto.response.OrderItemDetailResponse;
import com.trinhminhvi.techshop.order.dto.response.VariantAttributeResponse;
import com.trinhminhvi.techshop.order.entity.Coupon;
import com.trinhminhvi.techshop.order.entity.CouponUsage;
import com.trinhminhvi.techshop.order.entity.Order;
import com.trinhminhvi.techshop.order.entity.OrderItem;
import com.trinhminhvi.techshop.order.entity.Payment;
import com.trinhminhvi.techshop.order.enums.DiscountType;
import com.trinhminhvi.techshop.order.enums.OrderStatus;
import com.trinhminhvi.techshop.order.enums.PaymentProvider;
import com.trinhminhvi.techshop.order.enums.PaymentStatus;
import com.trinhminhvi.techshop.order.repository.CouponRepository;
import com.trinhminhvi.techshop.order.repository.CouponUsageRepository;
import com.trinhminhvi.techshop.order.repository.OrderItemRepository;
import com.trinhminhvi.techshop.order.repository.OrderRepository;
import com.trinhminhvi.techshop.order.repository.PaymentRepository;
import com.trinhminhvi.techshop.order.service.OrderService;
import com.trinhminhvi.techshop.product.entity.Product;
import com.trinhminhvi.techshop.product.entity.ProductImage;
import com.trinhminhvi.techshop.product.entity.ProductVariant;
import com.trinhminhvi.techshop.product.entity.VariantAttribute;
import com.trinhminhvi.techshop.product.repository.ProductVariantRepository;
import com.trinhminhvi.techshop.user.entity.Address;
import com.trinhminhvi.techshop.user.entity.User;
import com.trinhminhvi.techshop.user.repository.AddressRepository;
import com.trinhminhvi.techshop.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final AddressRepository addressRepository;
    private final CouponRepository couponRepository;
    private final CouponUsageRepository couponUsageRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;
    private final ProductVariantRepository productVariantRepository;

    // @PersistenceContext
    // private EntityManager entityManager;

    // Các hàm được helpper chức năng checkout

    // CÁC HÀM XỬ LÝ VẤN ĐỀ ĐỊA CHỈ KHI CHECKOUT

    // validate nghiệp vụ trước khi thao tác database.
    private void validateCheckoutRequest(CheckoutRequest request) {

        if (request.getUseSavedAddress()) {

            if (request.getAddressId() == null) {
                throw new RuntimeException("Address is required.");
            }

        } else {

            NewAddressRequest address = request.getNewAddress();

            if (address == null) {
                throw new RuntimeException("New address is required.");
            }

            if (address.getAddressLine() == null
                    || address.getAddressLine().isBlank()) {
                throw new RuntimeException("Address line is required.");
            }

            if (address.getDistrict() == null
                    || address.getDistrict().isBlank()) {
                throw new RuntimeException("District is required.");
            }

            if (address.getCity() == null
                    || address.getCity().isBlank()) {
                throw new RuntimeException("City is required.");
            }

            if (request.getSaveNewAddress() == null) {
                request.setSaveNewAddress(false);
            }
        }
    }

    // lấy address nếu đó là address đã có sẵn trong danh sách address của khách
    // hàng
    // mặc định các thông tin sẽ được lấy từ profile của user hiện tại
    private CheckoutAddress getSavedAddress(
            User user,
            CheckoutRequest request) {

        System.out.println("=====================================");
        System.out.println("Reciver Name is " + request.getReceiverName());
        System.out.println("Reciver Phone is " + request.getReceiverPhone());
        System.out.println("=====================================");

        System.out.println("=====================================");
        System.out.println("User Reciver Name is " + user.getFullName());
        System.out.println("User Reciver Phone is " + user.getPhone());
        System.out.println("=====================================");

        Address address = addressRepository
                .findByAddressIdAndUser(request.getAddressId(), user)
                .orElseThrow(() -> new RuntimeException("Address not found."));

        return CheckoutAddress.builder()
                .receiverName(
                        request.getReceiverName() == null || request.getReceiverName().isBlank()
                                ? user.getFullName()
                                : request.getReceiverName())
                .receiverPhone(
                        request.getReceiverPhone() == null || request.getReceiverPhone().isBlank()
                                ? user.getPhone()
                                : request.getReceiverPhone())
                .addressLine(address.getAddressLine())
                .district(address.getDistrict())
                .city(address.getCity())
                .build();
    }

    // lưu địa chỉ mới nếu khách hàng muốn lưu
    private void saveNewAddress(
            User user,
            NewAddressRequest request) {

        boolean hasAddress = addressRepository.existsByUser(user);

        boolean isDefault = request.isDefaultAddress();

        if (!hasAddress) {
            isDefault = true;
        }

        if (isDefault) {
            addressRepository.clearDefaultAddress(user);
        }

        Address address = Address.builder()
                .user(user)
                .addressLine(request.getAddressLine())
                .district(request.getDistrict())
                .city(request.getCity())
                .defaultAddress(isDefault)
                .build();

        addressRepository.save(address);
    }

    // lấy newAddress nếu khách hàng sử dụng địa chỉ mới
    // được lấy từ request của khách hàng trên tầng dto
    private CheckoutAddress getNewAddress(
            User user,
            CheckoutRequest request) {

        NewAddressRequest newAddress = request.getNewAddress();

        if (Boolean.TRUE.equals(request.getSaveNewAddress())) {
            saveNewAddress(user, newAddress);
        }

        return CheckoutAddress.builder()
                .receiverName(
                        request.getReceiverName() == null
                                || request.getReceiverName().isBlank()
                                        ? user.getFullName()
                                        : request.getReceiverName())
                .receiverPhone(
                        request.getReceiverPhone() == null
                                || request.getReceiverPhone().isBlank()
                                        ? user.getPhone()
                                        : request.getReceiverPhone())
                .addressLine(newAddress.getAddressLine())
                .district(newAddress.getDistrict())
                .city(newAddress.getCity())
                .build();
    }

    // xử lý vấn đề khách hàng sử dụng địa chỉ cũ hay mới.
    private CheckoutAddress getCheckoutAddress(
            User user,
            CheckoutRequest request) {

        if (request.getUseSavedAddress()) {
            return getSavedAddress(user, request);
        }

        return getNewAddress(user, request);
    }

    // CÁC HÀM XỬ LÝ CÁC VẤN ĐỀ VỀ CART KHI CHECKOUT

    // Lấy đúng các Item đã chọn từ cart và check xem cart đó có đúng của khách hàng
    // đó hay không
    private List<CartItem> getCheckoutCartItems(
            User user,
            CheckoutRequest request) {

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        List<CartItem> cartItems = cartItemRepository.findCheckoutItems(
                cart.getCartId(),
                request.getCartItemIds());

        if (cartItems.size() != request.getCartItemIds().size()) {
            throw new RuntimeException("Some cart items do not exist.");
        }

        return cartItems;
    }

    // Kiểm tra tồn kho trước khi tạo order
    private void validateStock(List<CartItem> cartItems) {

        for (CartItem cartItem : cartItems) {

            ProductVariant variant = cartItem.getProductVariant();

            if (variant.getStock() < cartItem.getQuantity()) {
                throw new RuntimeException(
                        variant.getProduct().getName()
                                + " does not have enough stock.");
            }

        }

    }

    // Tính tổng tiền đã có discount và thể hiện thông qua PriceSumary
    private PriceSummary calculatePriceSummary(List<CartItem> cartItems) {

        BigDecimal totalPrice = BigDecimal.ZERO;
        int totalQuantity = 0;

        for (CartItem cartItem : cartItems) {

            BigDecimal itemTotal = cartItem.getProductVariant()
                    .getPrice()
                    .multiply(BigDecimal.valueOf(cartItem.getQuantity()));

            totalPrice = totalPrice.add(itemTotal);

            totalQuantity += cartItem.getQuantity();
        }

        return PriceSummary.builder()
                .totalPrice(totalPrice)
                .discountAmount(BigDecimal.ZERO)
                .finalPrice(totalPrice)
                .totalQuantity(totalQuantity)
                .totalProduct(cartItems.size())
                .build();
    }

    // XỬ LÝ CÁC VẤN ĐỀ VỀ COUPON KHI CHECKOUT

    // Thực hiện các nhiệm vụ:
    // Không nhập coupon → trả về null
    // Coupon tồn tại
    // Coupon đang active
    // Chưa hết hạn
    // Đã đến ngày bắt đầu
    // Còn số lượng
    // Đơn hàng đủ điều kiện
    // User chưa sử dụng
    private Coupon validateCoupon(User user, CheckoutRequest request, PriceSummary priceSummary) {

        if (request.getCouponCode() == null || request.getCouponCode().isBlank()) {
            return null;
        }

        Coupon coupon = couponRepository.findByCode(request.getCouponCode())
                .orElseThrow(() -> new RuntimeException("Coupon not found"));

        if (!coupon.isActive()) {
            throw new RuntimeException("Coupon is inactive");
        }

        LocalDateTime now = LocalDateTime.now();

        if (coupon.getStartDate() != null && now.isBefore(coupon.getStartDate())) {
            throw new RuntimeException("Coupon has not started yet");
        }

        if (coupon.getExpireDate() != null && now.isAfter(coupon.getExpireDate())) {
            throw new RuntimeException("Coupon has expired");
        }

        if (coupon.getQuantity() <= 0) {
            throw new RuntimeException("Coupon is out of stock");
        }

        if (priceSummary.getTotalPrice().compareTo(coupon.getMinimumOrder()) < 0) {
            throw new RuntimeException(
                    "Minimum order value is " + coupon.getMinimumOrder());
        }

        boolean used = couponUsageRepository.existsByUserAndCoupon(user, coupon);

        if (used) {
            throw new RuntimeException("Coupon has already been used");
        }

        return coupon;
    }

    // Tính số tiền được giảm.
    private BigDecimal calculateDiscount(Coupon coupon, BigDecimal totalPrice) {

        if (coupon == null) {
            return BigDecimal.ZERO;
        }

        BigDecimal discount;

        if (coupon.getDiscountType() == DiscountType.PERCENT) {

            discount = totalPrice
                    .multiply(coupon.getDiscount())
                    .divide(BigDecimal.valueOf(100));

        } else {

            discount = coupon.getDiscount();

        }

        if (coupon.getMaximumDiscount() != null
                && discount.compareTo(coupon.getMaximumDiscount()) > 0) {

            discount = coupon.getMaximumDiscount();

        }

        return discount;
    }

    // Cập nhật PriceSumary
    private void applyCoupon(
            PriceSummary priceSummary,
            BigDecimal discountAmount) {

        priceSummary.setDiscountAmount(discountAmount);

        priceSummary.setFinalPrice(
                priceSummary.getTotalPrice()
                        .subtract(discountAmount));
    }

    // CÁC HÀM XỬ LÝ VIỆC TẠO ORDER VÀ LIÊN QUAN ĐẾN ORDER

    // Tạo order
    private Order createOrder(
            User user,
            CheckoutAddress checkoutAddress,
            CheckoutRequest request,
            PriceSummary priceSummary,
            Coupon coupon) {

        Order order = Order.builder()
                .user(user)
                .coupon(coupon)
                .receiverName(checkoutAddress.getReceiverName())
                .receiverPhone(checkoutAddress.getReceiverPhone())
                .receiverAddress(checkoutAddress.getAddressLine())
                .receiverDistrict(checkoutAddress.getDistrict())
                .receiverCity(checkoutAddress.getCity())
                .note(request.getNote())
                .paymentMethod(request.getPaymentMethod())
                .totalPrice(priceSummary.getTotalPrice())
                .discountAmount(priceSummary.getDiscountAmount())
                .finalPrice(priceSummary.getFinalPrice())
                .status(OrderStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return orderRepository.save(order);
    }

    // Tạo danh sách orderitems
    private void createOrderItems(
            Order order,
            List<CartItem> cartItems) {

        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cartItems) {

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .productVariant(cartItem.getProductVariant())
                    .price(cartItem.getProductVariant().getPrice())
                    .quantity(cartItem.getQuantity())
                    .build();

            orderItems.add(orderItem);
        }

        orderItemRepository.saveAll(orderItems);
    }

    // Tạo Payment
    private Payment createPayment(
            Order order,
            CheckoutRequest request,
            PriceSummary priceSummary) {

        Payment payment = Payment.builder()
                .order(order)
                .method(request.getPaymentMethod())
                .amount(priceSummary.getFinalPrice())
                .status(PaymentStatus.PENDING)
                .provider(PaymentProvider.INTERNAL)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return paymentRepository.save(payment);
    }

    // Cập nhật lại tồn kho
    private void updateStock(List<CartItem> cartItems) {

        for (CartItem cartItem : cartItems) {

            ProductVariant variant = cartItem.getProductVariant();

            variant.setStock(
                    variant.getStock() - cartItem.getQuantity());

        }

        productVariantRepository.saveAll(
                cartItems.stream()
                        .map(CartItem::getProductVariant)
                        .toList());
    }

    // Lưu lại coupon đã xử dụng
    private void saveCouponUsage(
            User user,
            Coupon coupon) {

        if (coupon == null) {
            return;
        }

        CouponUsage usage = CouponUsage.builder()
                .user(user)
                .coupon(coupon)
                .usedAt(LocalDateTime.now())
                .build();

        couponUsageRepository.save(usage);

        coupon.setQuantity(coupon.getQuantity() - 1);

        couponRepository.save(coupon);
    }

    // Xóa các sản phẩm đã checkout
    private void removeCartItems(List<CartItem> cartItems) {

        List<Integer> ids = cartItems.stream()
                .map(CartItem::getCartItemId)
                .toList();

        int deleted = cartItemRepository.deleteAllNative(ids);

        if (deleted != ids.size()) {
            throw new RuntimeException("Delete cart items failed.");
        }
    }

    // private void removeCartItems(List<CartItem> cartItems) {

    // Integer id = cartItems.get(0).getCartItemId();

    // System.out.println("Delete id = " + id);

    // System.out.println("Exists before = " + cartItemRepository.existsById(id));

    // cartItemRepository.deleteById(id);

    // cartItemRepository.flush();

    // System.out.println("Exists after = " + cartItemRepository.existsById(id));
    // }

    private CheckoutResponse buildCheckoutResponse(
            Order order,
            Payment payment) {

        return CheckoutResponse.builder()
                .orderId(order.getOrderId())
                .paymentMethod(payment.getMethod())
                .paymentStatus(payment.getStatus())
                .orderStatus(order.getStatus())
                .totalPrice(order.getTotalPrice())
                .discountAmount(order.getDiscountAmount())
                .finalPrice(order.getFinalPrice())
                .paymentUrl(payment.getPaymentUrl())
                .createdAt(order.getCreatedAt())
                .build();
    }

    // HELPER CHO CHỨC NĂNG GET ORDER
    private Page<Order> getOrderPage(
            User user,
            GetMyOrdersRequest request) {

        Pageable pageable = PageRequest.of(
                request.getPageNum() - 1,
                request.getPageSize(),
                Sort.by(Sort.Direction.DESC, "createdAt"));

        if (request.getStatus() == null) {
            return orderRepository.findByUserOrderByCreatedAtDesc(
                    user,
                    pageable);
        }

        return orderRepository.findByUserAndStatusOrderByCreatedAtDesc(
                user,
                request.getStatus(),
                pageable);
    }

    private List<Order> loadOrderDetails(Page<Order> orderPage) {

        if (orderPage.isEmpty()) {
            return Collections.emptyList();
        }

        List<String> orderIds = orderPage.getContent()
                .stream()
                .map(Order::getOrderId)
                .toList();

        return orderRepository.findByOrderIdIn(orderIds);
    }

    private OrderSummaryResponse mapOrderSummary(Order order) {

        OrderItem firstOrderItem = order.getOrderItems().get(0);

        Product product = firstOrderItem.getProductVariant().getProduct();

        String thumbnail = product.getProductImages()
                .stream()
                .filter(ProductImage::isThumbnail)
                .findFirst()
                .map(ProductImage::getImagePath)
                .orElse(null);

        String productName = product.getName();

        if (order.getOrderItems().size() > 1) {
            productName += " (+" + (order.getOrderItems().size() - 1) + ")";
        }

        return OrderSummaryResponse.builder()
                .orderId(order.getOrderId())
                .thumbnail(thumbnail)
                .productName(productName)
                .totalProduct(order.getOrderItems().size())
                .finalPrice(order.getFinalPrice())
                .paymentMethod(order.getPayment().getMethod())
                .paymentStatus(order.getPayment().getStatus())
                .orderStatus(order.getStatus())
                .createdAt(order.getCreatedAt())
                .build();
    }

    private PageableResponse<List<OrderSummaryResponse>> buildPageableResponse(
            Page<Order> orderPage,
            List<OrderSummaryResponse> responses) {

        return PageableResponse.<List<OrderSummaryResponse>>builder()
                .pageNum(orderPage.getNumber() + 1)
                .pageSize(orderPage.getSize())
                .totalElements(orderPage.getTotalElements())
                .totalPages(orderPage.getTotalPages())
                .items(responses)
                .build();
    }

    // HELPER cho hàm lấy chi tiết order

    private List<VariantAttributeResponse> mapVariantAttributes(
            List<VariantAttribute> variantAttributes) {

        return variantAttributes.stream()

                .map(attribute -> VariantAttributeResponse.builder()

                        .attributeName(
                                attribute.getAttrValue()
                                        .getAttribute()
                                        .getName())

                        .value(
                                attribute.getAttrValue()
                                        .getValue())

                        .build())

                .toList();
    }

    private OrderItemDetailResponse mapOrderItem(
            OrderItem orderItem) {

        ProductVariant variant = orderItem.getProductVariant();

        Product product = variant.getProduct();

        return OrderItemDetailResponse.builder()

                .productId(product.getProductId())

                .productName(product.getName())

                .thumbnail(product.getThumbnailPath())

                .sku(variant.getSku())

                .price(orderItem.getPrice())

                .quantity(orderItem.getQuantity())

                .attributes(
                        mapVariantAttributes(
                                variant.getVariantAttributes()))

                .build();
    }

    private OrderDetailResponse buildOrderDetailResponse(
            Order order) {

        Payment payment = order.getPayment();

        PaymentProvider provider = payment == null ? null : payment.getProvider();

        PaymentStatus status = payment == null ? null : payment.getStatus();

        return OrderDetailResponse.builder()
                .orderId(order.getOrderId())

                .receiverName(order.getReceiverName())
                .receiverPhone(order.getReceiverPhone())

                .receiverAddress(order.getReceiverAddress())
                .receiverDistrict(order.getReceiverDistrict())
                .receiverCity(order.getReceiverCity())

                .note(order.getNote())

                .paymentMethod(order.getPaymentMethod())
                .paymentProvider(provider)
                .paymentStatus(status)

                .orderStatus(order.getStatus())

                .totalPrice(order.getTotalPrice())
                .discountAmount(order.getDiscountAmount())
                .finalPrice(order.getFinalPrice())

                .couponCode(
                        order.getCoupon() == null
                                ? null
                                : order.getCoupon().getCode())

                .createdAt(order.getCreatedAt())

                .items(
                        order.getOrderItems()
                                .stream()
                                .map(this::mapOrderItem)
                                .toList())

                .build();
    }

    // HEPPER DÀNH CHO CHỨC NĂNG CANCELLED

    private void validateCancelable(Order order) {

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new RuntimeException(
                    "Only pending orders can be cancelled.");
        }
    }

    private void cancelOrderStatus(Order order) {

        order.setStatus(OrderStatus.CANCELLED);

        orderRepository.save(order);
    }

    private void cancelPayment(Order order) {

        Payment payment = order.getPayment();

        if (payment == null) {
            return;
        }

        switch (payment.getMethod()) {

            case COD -> payment.setStatus(
                    PaymentStatus.CANCELLED);

            case VNPAY, MOMO -> payment.setStatus(
                    PaymentStatus.REFUND_PENDING);
        }

        paymentRepository.save(payment);
    }

    private void restoreStock(Order order) {

        List<ProductVariant> variants = new ArrayList<>();

        for (OrderItem orderItem : order.getOrderItems()) {

            ProductVariant variant = orderItem.getProductVariant();

            variant.setStock(
                    variant.getStock() + orderItem.getQuantity());

            variants.add(variant);
        }

        productVariantRepository.saveAll(variants);
    }

    private void restoreCoupon(User user, Order order) {

        Coupon coupon = order.getCoupon();

        if (coupon == null) {
            return;
        }

        couponUsageRepository.deleteByUserAndCoupon(
                user,
                coupon);

        coupon.setQuantity(
                coupon.getQuantity() + 1);

        couponRepository.save(coupon);
    }

    // Hàm chức năng

    @Override
    @Transactional(readOnly = true)
    public PageableResponse<List<OrderSummaryResponse>> getMyOrders(
            String userId,
            GetMyOrdersRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Page<Order> orderPage = getOrderPage(user, request);

        List<Order> orders = loadOrderDetails(orderPage);

        Map<String, Order> orderMap = orders.stream()
                .collect(Collectors.toMap(
                        Order::getOrderId,
                        Function.identity()));

        List<OrderSummaryResponse> responses = orderPage.getContent()
                .stream()
                .map(order -> mapOrderSummary(orderMap.get(order.getOrderId())))
                .toList();

        return buildPageableResponse(orderPage, responses);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderDetailResponse getMyOrderDetail(String userId, String orderId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found."));

        Order order = orderRepository.findOrderDetail(orderId, user)
                .orElseThrow(() -> new RuntimeException("Order not found."));

        return buildOrderDetailResponse(order);
    }

    // CHECKOUT

    @Override
    @Transactional
    public CheckoutResponse checkout(String userId, CheckoutRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        validateCheckoutRequest(request);

        CheckoutAddress checkoutAddress = getCheckoutAddress(user, request);

        // System.out.println("==============================");
        // System.out.println("Address đã tạo trong checkout");

        // System.out.println(checkoutAddress.getReceiverName());
        // System.out.println(checkoutAddress.getReceiverPhone());

        List<CartItem> cartItems = getCheckoutCartItems(user, request);

        validateStock(cartItems);

        PriceSummary priceSummary = calculatePriceSummary(cartItems);

        Coupon coupon = validateCoupon(user, request, priceSummary);

        BigDecimal discount = calculateDiscount(
                coupon,
                priceSummary.getTotalPrice());

        applyCoupon(priceSummary, discount);

        Order order = createOrder(
                user,
                checkoutAddress,
                request,
                priceSummary,
                coupon);

        createOrderItems(order, cartItems);

        Payment payment = createPayment(
                order,
                request,
                priceSummary);

        updateStock(cartItems);

        saveCouponUsage(user, coupon);

        // removeCartItems(cartItems);

        return buildCheckoutResponse(order, payment);
    }

    @Override
    @Transactional
    public void cancelOrder(String userId, String orderId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found."));

        Order order = orderRepository.findByOrderIdAndUser(orderId, user)
                .orElseThrow(() -> new RuntimeException("Order not found."));

        validateCancelable(order);

        cancelOrderStatus(order);

        cancelPayment(order);

        restoreStock(order);

        restoreCoupon(user, order);
    }



}
