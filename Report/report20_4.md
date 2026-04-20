# Network Tab trong Developer Tools (F12)

---

## 1. Tổng quan
Trong quá trình phát triển Web, việc hiểu cách trình duyệt (Client) trao đổi dữ liệu với máy chủ (Server) là cực kỳ quan trọng. Tab **Network** trong Chrome DevTools cung cấp cái nhìn chi tiết về các yêu cầu HTTP (HTTP Requests), giúp lập trình viên kiểm tra dữ liệu gửi đi và phản hồi nhận về.

## 2. Các thành phần chính của một Request

### 2.1. Headers (Tiêu đề)
Headers chứa các thông tin siêu dữ liệu (metadata) dùng để mô tả yêu cầu hoặc phản hồi.

* **General (Thông tin chung):**
    * `Request URL`: Địa chỉ API hoặc trang web đang được gọi.
    * `Request Method`: Phương thức HTTP (GET, POST, PUT, DELETE,...).
    * `Status Code`: Mã trạng thái phản hồi từ server (Ví dụ: `200 OK`, `404 Not Found`, `500 Internal Server Error`).
* **Request Headers (Client gửi đi):**
    * `Authorization`: Chứa token xác thực (Bearer token).
    * `User-Agent`: Thông tin về trình duyệt và hệ điều hành của người dùng.
    * `Content-Type`: Định dạng của dữ liệu gửi đi (Ví dụ: `application/json`).
* **Response Headers (Server trả về):**
    * `Content-Type`: Định dạng dữ liệu trả về (HTML, JSON, Image).
    * `Set-Cookie`: Lệnh từ server yêu cầu trình duyệt lưu trữ cookie.

### 2.2. Payload (Dữ liệu gửi đi)
Payload là phần nội dung thực tế mà Client gửi lên Server để xử lý.
* **Đặc điểm:** Thường xuất hiện rõ nhất trong các phương thức `POST`, `PUT`, hoặc `PATCH`.
* **Ví dụ:** Khi thực hiện chức năng Đăng nhập, Payload sẽ chứa:
    ```json
    {
      "username": "user_example",
      "password": "hashed_password"
    }
    ```
* **Query String Parameters:** Đối với phương thức `GET`, Payload thường nằm dưới dạng các tham số trên URL (ví dụ: `?search=iphone&page=1`).

### 2.3. Response (Dữ liệu phản hồi)
Response là kết quả mà Server trả về cho Client sau khi xử lý yêu cầu thành công hoặc thất bại.
* **Định dạng phổ biến:** * **JSON:** Dùng cho các ứng dụng Modern Web/Mobile App (phổ biến nhất khi gọi API).
    * **HTML:** Trả về toàn bộ cấu trúc trang web.
    * **Dữ liệu nhị phân:** Hình ảnh, tệp tin PDF, video.
* **Tầm quan trọng:** Đây là dữ liệu mà phía Frontend sẽ dùng để hiển thị lên giao diện cho người dùng cuối.

---

## 3. Ví dụ thực tế (Workflow)
1.  **Bước 1:** Người dùng điền form tìm kiếm và nhấn Enter.
2.  **Bước 2 (Payload):** Trình duyệt đóng gói từ khóa tìm kiếm vào **Payload**.
3.  **Bước 3 (Headers):** Trình duyệt thêm các thông tin xác thực vào **Headers** và gửi yêu cầu đến Server.
4.  **Bước 4 (Response):** Server xử lý, truy vấn DB và trả về danh sách kết quả dưới dạng JSON trong phần **Response**.

## 4. Kết luận
Việc thành thạo công cụ Network giúp:
- Debug lỗi API nhanh chóng.
- Kiểm tra hiệu suất tải trang.
- Đảm bảo an mật thông tin (không lộ dữ liệu nhạy cảm trong headers/payload).


