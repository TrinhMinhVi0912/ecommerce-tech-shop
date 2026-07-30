# UI DESIGN RULES - TECH SHOP

## 1. Mục tiêu

Toàn bộ giao diện của Tech Shop phải tuân theo cùng một hệ thống thiết kế (Design System) nhằm:

* Đảm bảo tính nhất quán giữa các trang.
* Mang lại trải nghiệm người dùng hiện đại và chuyên nghiệp.
* Dễ bảo trì và mở rộng trong tương lai.
* Tối ưu khả năng tái sử dụng component.

---

# 2. Phong cách thiết kế

Website theo phong cách:

* Modern
* Minimal
* Clean
* Professional

Tham khảo:

* Apple Store
* CellphoneS
* FPT Shop
* Asus Store

Không sử dụng giao diện màu mè hoặc quá nhiều hiệu ứng.

---

# 3. Màu sắc

## Primary

```
#2563EB
```

Dùng cho

* Button chính
* Link
* Icon đang active
* Badge

---

## Primary Hover

```
#1D4ED8
```

---

## Success

```
#16A34A
```

---

## Warning

```
#F59E0B
```

---

## Danger

```
#DC2626
```

---

## Background

```
#F8FAFC
```

---

## Card

```
#FFFFFF
```

---

## Border

```
#E2E8F0
```

---

## Text

### Chính

```
#0F172A
```

### Phụ

```
#64748B
```

---

# 4. Font

Font duy nhất

```
Inter
```

Không sử dụng nhiều font.

---

# 5. Border Radius

Card

```
rounded-xl
```

Button

```
rounded-lg
```

Input

```
rounded-lg
```

Avatar

```
rounded-full
```

---

# 6. Shadow

Card

```
shadow-sm
```

Hover

```
shadow-md
```

Không sử dụng shadow quá đậm.

---

# 7. Khoảng cách

Padding trang

```
px-8
```

Desktop

Khoảng cách giữa section

```
py-12
```

Card

```
p-6
```

Gap

```
gap-6
```

---

# 8. Button

Primary

* nền Primary
* chữ trắng

Secondary

* nền trắng
* border Primary

Danger

* nền đỏ

Button luôn có

```
transition
duration-200
```

Hover

```
scale-105
```

---

# 9. Input

Tất cả Input

* border xám
* bo góc
* focus màu Primary

Không dùng outline mặc định.

---

# 10. Card

Card luôn gồm

* ảnh
* nội dung
* action

Padding

```
24px
```

Bo góc

```
rounded-xl
```

---

# 11. Icon

Dùng

```
lucide-react
```

Không dùng nhiều bộ icon khác nhau.

Kích thước

```
20px
```

Hoặc

```
24px
```

---

# 12. Animation

Chỉ sử dụng animation nhẹ

Hover

* đổi màu
* shadow
* scale

Không sử dụng

* xoay
* rung
* nhấp nháy

---

# 13. Responsive

Breakpoint

```
sm
md
lg
xl
```

Desktop ưu tiên.

Mobile tối ưu sau.

Không để xuất hiện thanh cuộn ngang.

---

# 14. Layout

Có 3 Layout

* UserLayout
* AdminLayout
* AuthLayout

Không tạo thêm Layout mới nếu không thật sự cần thiết.

---

# 15. Component

Mọi component phải có khả năng tái sử dụng.

Ví dụ

* Button
* Input
* Pagination
* SearchBar
* ProductCard
* ConfirmDialog
* Loading
* Modal

Không viết trùng component.

---

# 16. API

Tất cả request đều thông qua

```
axiosClient
```

Không gọi axios trực tiếp trong Page.

---

# 17. Thông báo

Toast

```
react-hot-toast
```

hoặc

```
sonner
```

Không dùng alert().

---

# 18. Loading

Mọi request đều có

* Loading
* Empty Data
* Error

Không để màn hình trắng.

---

# 19. Hình ảnh

Nếu ảnh lỗi

Hiển thị

```
default-product.png
```

Avatar

```
default-avatar.png
```

Banner

```
default-banner.png
```

---

# 20. Quy tắc viết code

* Một component chỉ làm một nhiệm vụ.
* Không viết JSX quá 200 dòng.
* Tách component khi cần.
* Không viết logic API trong UI.
* Không hard-code dữ liệu.
* Ưu tiên tái sử dụng component.
* Đặt tên rõ ràng, thống nhất theo PascalCase hoặc camelCase.

---

# 21. Mục tiêu cuối cùng

Toàn bộ giao diện phải mang lại cảm giác:

* Sạch
* Hiện đại
* Chuyên nghiệp
* Đồng nhất
* Dễ sử dụng
* Tốc độ phản hồi nhanh
* Trải nghiệm người dùng tốt trên cả Desktop và Mobile
