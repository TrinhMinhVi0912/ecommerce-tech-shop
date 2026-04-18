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
    role_id INT NOT NULL,
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
    user_id CHAR(36) NOT NULL,
    address_line VARCHAR(255),
    city VARCHAR(255),
    district VARCHAR(255),
    is_default BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);


-- Categories
CREATE TABLE categories (
    categories_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    parent_id INT,
    FOREIGN KEY (parent_id) REFERENCES categories(categories_id) ON DELETE SET NULL
);

-- Brand
CREATE TABLE brand (
    brand_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255)
);

-- Product
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    brand_id INT NOT NULL,
    categories_id INT NOT NULL,
    name VARCHAR(255),
    description TEXT,
    base_price DECIMAL(12,2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (brand_id) REFERENCES brand(brand_id) ON DELETE RESTRICT,
    FOREIGN KEY (categories_id) REFERENCES categories(categories_id)
);

-- Product_Img
CREATE TABLE product_img (
    img_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_path VARCHAR(1024),
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);


-- PRODUCT VARIANTS
CREATE TABLE product_variants (
    variant_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    price DECIMAL(12,2),
    stock INT,
    sku VARCHAR(255) UNIQUE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);


-- Các bảng liên quan ATTRIBUTES
CREATE TABLE attributes (
    attribute_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    UNIQUE (name)
);

CREATE TABLE attribute_values (
    attr_value_id INT AUTO_INCREMENT PRIMARY KEY,
    attribute_id INT NOT NULL,
    value VARCHAR(255),
    FOREIGN KEY (attribute_id) REFERENCES attributes(attribute_id),
    UNIQUE (attribute_id, value)
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
    user_id CHAR(36) NOT NULL UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE cart_item (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    variant_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    FOREIGN KEY (cart_id) REFERENCES carts(id_cart),
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id),
    UNIQUE (cart_id, variant_id)
);


-- Các bảng liên quan Coupon
CREATE TABLE coupon (
    coupon_id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE,
    discount_type ENUM('PERCENT', 'FIXED'),
    discount DECIMAL(10,2),
    expire_date DATETIME
);

CREATE TABLE coupon_usages (
    user_id CHAR(36),
    coupon_id INT,
    PRIMARY KEY (user_id, coupon_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (coupon_id) REFERENCES coupon(coupon_id)
);

-- Order
CREATE TABLE orders (
    order_id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    coupon_id INT,
    total_price DECIMAL(12,2),
    discount_amount DECIMAL(12,2),
    final_price DECIMAL(12,2),
    status VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (coupon_id) REFERENCES coupon(coupon_id)
);


-- Order Item
CREATE TABLE order_item (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id CHAR(36) NOT NULL,
    variant_id INT NOT NULL,
    price DECIMAL(12,2),
    quantity INT NOT NULL DEFAULT 1,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id),
    UNIQUE (order_id, variant_id)
);

-- Payment
CREATE TABLE payments (
    payment_id CHAR(36) PRIMARY KEY,
    order_id CHAR(36) UNIQUE NOT NULL,
    method VARCHAR(255),
    status VARCHAR(120),
    transaction_id VARCHAR(255) UNIQUE,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- Wishlist
CREATE TABLE wishlist (
    user_id CHAR(36),
    product_id INT,
    PRIMARY KEY (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Review
CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    product_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment VARCHAR(1024),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE INDEX idx_product_category ON products(categories_id);
CREATE INDEX idx_product_brand ON products(brand_id);
CREATE INDEX idx_order_user ON orders(user_id);