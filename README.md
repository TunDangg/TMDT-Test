# Ứng dụng Thương mại Điện tử (TMDT-Test)

![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![NestJS](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

Một hệ thống Thương mại điện tử Fullstack hiện đại được thiết kế với giao diện người dùng tương tác cao và kiến trúc Backend module hóa chặt chẽ, an toàn.

## Giới thiệu dự án

Dự án này là một nền tảng mua sắm trực tuyến, phân tách rõ ràng luồng xử lý giữa Client-side (Frontend) và Server-side (Backend).
Hệ thống cung cấp trải nghiệm mua sắm mượt mà cho khách hàng và các công cụ quản trị dữ liệu hiệu quả cho Admin.

### Tính năng nổi bật
* **Xác thực & Bảo mật:** Đăng nhập/Đăng ký an toàn sử dụng JSON Web Token (JWT) và mã hóa mật khẩu Bcrypt.
* **Quản lý Sản phẩm & Giỏ hàng:** Hiển thị danh sách sản phẩm, thêm vào giỏ hàng và xử lý luồng thanh toán.
* **Quản lý Đơn hàng & Khuyến mãi:** Theo dõi trạng thái đơn hàng, áp dụng mã giảm giá (Voucher).
* **Trang quản trị (Admin Dashboard):** Phân quyền quản trị viên, quản lý danh mục, người dùng và khách hàng tiềm năng (Leads).

## Nền tảng Công nghệ (Tech Stack)

### Frontend
* **Core:** Vue 3, TypeScript, Vite.
* **State Management:** Pinia.
* **Routing:** Vue Router.
* **UI/Styling:** Tailwind CSS, Ant Design Vue, Lucide Icons.
* **Network:** Axios.

### Backend
* **Core:** Node.js, NestJS, TypeScript.
* **Database & ORM:** MySQL, TypeORM.
* **Validation:** class-validator, class-transformer.
* **Testing:** Jest, Supertest.

## Hướng dẫn Cài đặt & Chạy dự án

### Yêu cầu hệ thống (Prerequisites)
* Node.js (phiên bản 20.x trở lên)
* MySQL (đã thiết lập user và database cho dự án)

### 1. Cài đặt Backend (NestJS)

Mở terminal và di chuyển vào thư mục `backend`:

```bash
cd backend
# Cài đặt các thư viện phụ thuộc
npm install

# Khởi chạy server ở chế độ Development (mặc định cấu hình CORS đã được mở)
npm run start:dev