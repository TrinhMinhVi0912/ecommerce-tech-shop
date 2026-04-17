-- Tạo DB
CREATE DATABASE techshop;
USE techshop;

-- User và Roles
CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE users (
    user_id CHAR(36) PRIMARY KEY,
    role_id INT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(120),
    phone VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

-- Address
CREATE TABLE addresses (
    address_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36),
    address_line VARCHAR(255),
    city VARCHAR(255),
    district VARCHAR(255),
    is_default BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Wishlist
CREATE TABLE wishlist (
    user_id CHAR(36),
    product_id INT,
    PRIMARY KEY (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Review
CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36),
    product_id INT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment VARCHAR(1024),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Categories
CREATE TABLE categories (
    categories_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    parent_id INT,
    FOREIGN KEY (parent_id) REFERENCES categories(categories_id)
);

-- Brand
CREATE TABLE brand (
    brand_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255)
);

-- Product
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    brand_id INT,
    categories_id INT,
    name VARCHAR(255),
    description TEXT,
    base_price INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (brand_id) REFERENCES brand(brand_id),
    FOREIGN KEY (categories_id) REFERENCES categories(categories_id)
);

-- Product_Img
CREATE TABLE product_img (
    img_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    image_path VARCHAR(1024),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);


-- PRODUCT VARIANTS
CREATE TABLE product_variants (
    variant_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    price INT,
    stock INT,
    sku VARCHAR(255) UNIQUE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);


-- Các bảng liên quan ATTRIBUTES
CREATE TABLE attributes (
    attribute_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE attribute_values (
    attr_value_id INT AUTO_INCREMENT PRIMARY KEY,
    attribute_id INT,
    value VARCHAR(255),
    FOREIGN KEY (attribute_id) REFERENCES attributes(attribute_id)
);

CREATE TABLE variant_attributes (
    variant_id INT,
    attr_value_id INT,
    PRIMARY KEY (variant_id, attr_value_id),
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id),
    FOREIGN KEY (attr_value_id) REFERENCES attribute_values(attr_value_id)
);

-- Các bảng liên quan Cart
CREATE TABLE carts (
    id_cart INT AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE cart_item (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT,
    variant_id INT,
    quantity INT,
    FOREIGN KEY (cart_id) REFERENCES carts(id_cart),
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id)
);


-- Các bảng liên quan Coupon
CREATE TABLE coupon (
    coupon_id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE,
    discount FLOAT,
    expire_date DATETIME
);

CREATE TABLE coupon_usages (
    user_id CHAR(36),
    coupon_id INT,
    PRIMARY KEY (user_id, coupon_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (coupon_id) REFERENCES coupon(coupon_id)
);

-- Order
CREATE TABLE orders (
    order_id CHAR(36) PRIMARY KEY,
    user_id CHAR(36),
    coupon_id INT,
    total_price INT,
    discount_amount INT,
    final_price INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (coupon_id) REFERENCES coupon(coupon_id)
);


-- Order Item
CREATE TABLE order_item (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id CHAR(36),
    variant_id INT,
    price INT,
    quantity INT,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id)
);

-- Payment
CREATE TABLE payments (
    payment_id CHAR(36) PRIMARY KEY,
    order_id CHAR(36),
    method VARCHAR(255),
    status VARCHAR(120),
    transaction_id VARCHAR(255) UNIQUE,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

-- Nếu lỗi foreign key 
SET FOREIGN_KEY_CHECKS = 0;
-- import
SET FOREIGN_KEY_CHECKS = 1;