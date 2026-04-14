# TỐI ƯU HỆ THỐNG VỚI REDIS VÀ MESSAGE QUEUE

---

## 1. Đặt vấn đề
Khi phát triển các ứng dụng web (như dự án E-commerce), hệ thống thường đối mặt với hai thách thức lớn:
1.  **Độ trễ (Latency):** Việc truy vấn liên tục vào MySQL cho các dữ liệu ít thay đổi làm chậm tốc độ phản hồi.
2.  **Quá tải (Overload):** Các tác vụ nặng (gửi email xác nhận, xử lý ảnh, tích hợp thanh toán QR) chiếm dụng tài nguyên xử lý chính, khiến người dùng phải chờ đợi lâu.

**Giải pháp:** Áp dụng Redis (Caching) và Message Queue (Xử lý bất đồng bộ).

---

## 2. Redis (Remote Dictionary Server)

### 2.1. Định nghĩa
Redis là một cơ sở dữ liệu lưu trữ trên RAM (In-memory), hỗ trợ cấu trúc dữ liệu Key-Value với tốc độ đọc/ghi cực nhanh (sub-millisecond).

### 2.2. Các kịch bản ứng dụng (Use-cases)
* **Caching:** Lưu trữ kết quả của các query phức tạp hoặc danh sách sản phẩm trang chủ.
    * *Luồng đi:* Request -> Check Redis (Hit/Miss) -> Nếu Miss thì query MySQL -> Lưu lại vào Redis -> Trả về kết quả.
* **Session Management:** Lưu trữ JWT/Session để kiểm tra trạng thái đăng nhập nhanh chóng.
* **Rate Limiting:** Sử dụng Redis Counter để giới hạn số lượng request từ một IP nhằm bảo vệ API.

### 2.3. Ưu điểm trong hệ sinh thái NestJS
* Tương thích tốt qua các thư viện như `cache-manager-redis-yet`.
* Hỗ trợ TTL (Time-to-live) để tự động giải phóng bộ nhớ.

---

## 3. Message Queue (Hàng đợi tin nhắn)

### 3.1. Định nghĩa
Message Queue là cơ chế giao tiếp bất đồng bộ giữa các thành phần trong hệ thống. Nó cho phép một service gửi tin nhắn (Producer) vào hàng đợi (Queue) mà không cần chờ service nhận (Consumer) xử lý xong ngay lập tức.

### 3.2. Tại sao cần Message Queue?
* **Decoupling (Tách rời):** Service thanh toán không cần biết Service gửi Email hoạt động ra sao, chỉ cần đẩy yêu cầu vào Queue.
* **Scalability (Khả năng mở rộng):** Khi lượng đơn hàng tăng đột biến, ta có thể tăng số lượng Worker để xử lý Queue mà không làm treo Server chính.
* **Resiliency (Khả năng phục hồi):** Nếu Service gửi Email gặp sự cố, tin nhắn vẫn nằm trong Queue và sẽ được xử lý lại khi Service hoạt động trở lại.

### 3.3. Ví dụ thực tế: Luồng Thanh toán VietQR
1.  Người dùng thanh toán thành công.
2.  Hệ thống cập nhật trạng thái đơn hàng trong MySQL.
3.  **Producer** đẩy một "Job" vào Queue: `send_email_invoice`.
4.  Server trả về phản hồi "Thành công" cho User ngay lập tức.
5.  **Consumer (Worker)** lấy Job từ Queue ra và thực hiện gọi API gửi Email ngầm.

---

## 4. Giải pháp tích hợp: BullMQ trong NestJS

Trong môi trường NestJS, việc kết hợp Redis và Message Queue thường được thực hiện thông qua thư viện **BullMQ**.

* **Redis đóng vai trò là Backend:** Lưu trữ danh sách các Jobs trong hàng đợi.
* **BullMQ đóng vai trò điều phối:** Quản lý vòng đời của Job (Waiting, Active, Completed, Failed).

### Ví dụ cấu trúc thư mục đề xuất:
- `src/modules/order/` (Producer: Tạo đơn hàng và đẩy Job vào Queue)
- `src/modules/mail-worker/` (Consumer: Xử lý việc gửi mail từ Queue)

---

## 5. Kết luận
Việc áp dụng Redis và Message Queue là bước đi cần thiết để chuyển dịch từ một ứng dụng đơn lẻ sang một hệ thống có khả năng chịu tải tốt và trải nghiệm người dùng mượt mà.

