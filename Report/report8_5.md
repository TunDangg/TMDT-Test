# NestJS Core Concepts: Security & Luồng xử lý dữ liệu

Authentication, Authorization, Interceptors và Exception Filters, giúp xây dựng hệ thống backend bảo mật và chuyên nghiệp.

---

## 1. Bảo mật: Authentication & Authorization (Guards)

Trong NestJS, **Guards** là lớp bảo vệ chính để xác thực và phân quyền.

### Authentication (Xác thực)
- **Mục tiêu:** Trả lời câu hỏi "Người dùng này là ai?".
- **Cơ chế:** Thường sử dụng **JWT (JSON Web Token)**. Guard sẽ kiểm tra token trong Header của request.
- **Kết quả:** - Thành công: Gắn thông tin `user` vào object `request`.
    - Thất bại: Trả về lỗi `401 Unauthorized`.

### Authorization (Phân quyền)
- **Mục tiêu:** Trả lời câu hỏi "Người dùng này có quyền làm việc này không?".
- **Cơ chế:** Dựa trên các **Roles** (ví dụ: `Admin`, `User`, `Manager`). Sau khi đã xác thực, Guard sẽ kiểm tra Role của user có khớp với yêu cầu của API hay không.
- **Ví dụ thực tế:** Chỉ có Role `Admin` mới được quyền Xóa sản phẩm trong hệ thống E-commerce.
- **Kết quả:** Nếu không đủ quyền, trả về lỗi `403 Forbidden`.

---

## 2. Interceptors (Bộ can thiệp)

Interceptors lấy cảm hứng từ lập trình hướng khía cạnh (AOP), cho phép bạn can thiệp vào cả hai chiều: **Trước khi** xử lý logic và **Sau khi** trả về kết quả.

### Ứng dụng phổ biến:
- **Transform Response:** Chuẩn hóa định dạng dữ liệu trả về cho client (ví dụ: bọc dữ liệu vào object `{ success: true, data: ... }`).
- **Logging:** Theo dõi thời gian xử lý của một API.
- **Caching:** Trả về dữ liệu từ bộ nhớ đệm nếu có, giúp giảm tải cho Server.
- **Timeout:** Tự động ngắt request nếu xử lý quá lâu.

---

## 3. Exception Filters (Bộ lọc ngoại lệ)

Exception Filters là nơi xử lý lỗi tập trung cho toàn bộ ứng dụng. Thay vì dùng `try-catch` ở mọi nơi, bạn để Filter tự động bắt các ngoại lệ.

### Lợi ích:
- **Kiểm soát thông tin lỗi:** Tránh việc lộ thông tin nhạy cảm của hệ thống (như lỗi truy vấn Database) ra ngoài.
- **Định dạng lỗi đồng nhất:** Đảm bảo mọi lỗi trả về cho client đều có chung một cấu trúc JSON (statusCode, message, timestamp...).
- **Xử lý logic bổ sung:** Ví dụ: Ghi log lỗi vào file hoặc gửi cảnh báo khi có lỗi nghiêm trọng.

---

## 4. Vòng đời của một Request (Request Lifecycle)

Hiểu rõ thứ tự thực thi giúp bạn debug và tổ chức code hiệu quả hơn. Thứ tự như sau:

1.  **Middleware:** Tiền xử lý (như `cors`, `helmet`, `body-parser`).
2.  **Guards:** Kiểm tra quyền truy cập (Auth).
3.  **Interceptors (Trước handler):** Chuẩn bị dữ liệu hoặc ghi log.
4.  **Pipes:** Kiểm tra và chuyển đổi kiểu dữ liệu đầu vào (DTO).
5.  **Controller / Service:** Thực hiện logic nghiệp vụ chính.
6.  **Interceptors (Sau handler):** Biến đổi kết quả trả về.
7.  **Exception Filters:** Được gọi nếu có bất kỳ lỗi nào xảy ra trong các bước trên.
