# CRUD và RESTful API

**Mục tiêu:** Trình bày sự hiểu biết về hai khái niệm nền tảng trong phát triển Web Backend (CRUD và RESTful API), kết hợp với các ví dụ thực tế và phương án áp dụng vào thiết kế hệ thống thương mại điện tử (Dự án TMDT-Test).

---

## 1. CRUD 

**CRUD** là chữ viết tắt của 4 thao tác cốt lõi nhất để làm việc với Cơ sở dữ liệu (Database). Hầu hết mọi tính năng trên Website đều được xây dựng xung quanh 4 hành động này.

* **C - Create (Tạo mới):** Quá trình xử lý, kiểm tra tính hợp lệ và lưu trữ một bản ghi hoàn toàn mới vào Database.
    * *Ví dụ:* Khách hàng đặt mua sản phẩm trên website TMĐT (tạo mới đơn hàng), hoặc người dùng đăng một bình luận mới trên Facebook.
* **R - Read (Đọc/Truy xuất):** Quá trình lấy dữ liệu từ Database để máy chủ phản hồi và hiển thị lên giao diện cho người dùng xem.
    * *Ví dụ:* Người dùng click xem thông tin chi tiết một sản phẩm (giá, kích thước), hoặc lướt xem danh sách các bài viết trên News Feed.
* **U - Update (Cập nhật):** Quá trình chỉnh sửa thông tin của một bản ghi đã tồn tại từ trước (thường dựa trên ID định danh), không tạo ra dòng dữ liệu mới.
    * *Ví dụ:* Quản trị viên cập nhật lại giá sản phẩm, hoặc người dùng thay đổi mật khẩu tài khoản.
* **D - Delete (Xóa):** Quá trình loại bỏ một bản ghi đã có khỏi cơ sở dữ liệu.
    * *Ví dụ:* Quản trị viên xóa một bài viết sai phạm, hoặc người dùng xóa bình luận của chính họ.

> 💡 **Điểm nhấn thực tế: Cơ chế Xóa Mềm (Soft Delete)**
> Trong các dự án lập trình thực tế, thay vì xóa vĩnh viễn dữ liệu (Hard Delete), hệ thống thường áp dụng **Soft Delete**. Quá trình "xóa" thông qua giao diện thực chất chỉ là hành động **ẩn dữ liệu** (ví dụ: cập nhật trạng thái `is_deleted = true` trong Database).
> Điều này cực kỳ quan trọng để đảm bảo tính toàn vẹn của dữ liệu, cho phép phục hồi khi cần thiết và giữ lại lịch sử để thống kê (ví dụ: khách hàng "Hủy đơn hàng" thì đơn hàng đó chỉ bị ẩn đi thay vì bị xóa mất hoàn toàn dấu vết khỏi hệ thống).

## 2. RESTful API 

**API (Application Programming Interface)** là phương thức để các ứng dụng/dịch vụ độc lập giao tiếp với nhau (ví dụ: Frontend gọi Backend để lấy dữ liệu).

**RESTful API** là một tiêu chuẩn thiết kế API dựa trên kiến trúc REST. Một API được gọi là RESTful khi tuân thủ các nguyên tắc:

1.  **Dựa trên Tài nguyên (Resource-Based):** Mọi thực thể (Users, Products, Orders) đều là tài nguyên. Các URL (Endpoint) được đặt tên bằng **danh từ số nhiều**, không chứa động từ.
2.  **Sử dụng HTTP Methods:** Sử dụng chính các phương thức của giao thức HTTP (GET, POST, PUT, DELETE) để định nghĩa hành động (tương ứng với CRUD) cần thực hiện trên tài nguyên.
3.  **Không lưu trạng thái (Stateless):** Mỗi request từ Client gửi lên Server phải chứa đủ mọi thông tin cần thiết. Server không lưu trữ trạng thái của Client giữa các request.
4.  **Định dạng dữ liệu chuẩn:** Phổ biến nhất hiện nay là giao tiếp bằng chuỗi **JSON**.

## 3. Ánh xạ CRUD vào RESTful API (Thiết kế hệ thống TMDT)

Thay vì tạo ra vô số các URL chứa động từ lộn xộn (như `/create-order`, `/delete-order`), chúng ta áp dụng tiêu chuẩn RESTful để thống nhất các thao tác CRUD trên cùng một tài nguyên.

Dưới đây là bảng thiết kế API tham khảo cho phân hệ Quản lý Đơn hàng (Orders):

| Thao tác CRUD | HTTP Method | Endpoint (URL) | Mô tả chức năng |
| :--- | :--- | :--- | :--- |
| **Create** | `POST` | `/api/orders` | Khách hàng đặt hàng. Payload chứa giỏ hàng và địa chỉ. |
| **Read** | `GET` | `/api/orders` | Admin lấy danh sách toàn bộ đơn hàng (kèm phân trang/lọc). |
| **Read** | `GET` | `/api/orders/{id}` | Xem chi tiết thông tin của đơn hàng `{id}`. |
| **Update** | `PUT` / `PATCH` | `/api/orders/{id}` | Cập nhật trạng thái đơn hàng `{id}` (vd: từ "Chờ xử lý" sang "Đang giao"). |
| **Delete** | `DELETE` | `/api/orders/{id}` | Khách hàng hủy đơn (Thực hiện Soft Delete chuyển trạng thái thành Canceled). |

## 4. HTTP Status Code (Mã trạng thái phản hồi)

Để Frontend có thể xử lý logic giao diện chính xác, Backend RESTful cần trả về mã trạng thái HTTP chuẩn mực:

* **200 OK:** Request thành công (thường dùng cho GET, PUT, PATCH, DELETE).
* **201 Created:** Tạo mới tài nguyên thành công (kết quả của POST).
* **400 Bad Request:** Dữ liệu Client gửi lên bị sai hoặc thiếu trường bắt buộc.
* **401 Unauthorized:** Client chưa được xác thực (chưa đăng nhập hoặc Token không hợp lệ).
* **404 Not Found:** Tài nguyên yêu cầu không tồn tại (vd: tìm `{id}` không có trong Database).
* **500 Internal Server Error:** Lỗi hệ thống bất ngờ từ phía Server.

## 5. Ví dụ minh họa dòng chảy dữ liệu (JSON)

**Request: Tạo mới đơn hàng (POST `/api/orders`)**
```json
{
  "userId": 99,
  "shippingAddress": "136 Xuân Thủy, Cầu Giấy, Hà Nội",
  "items": [
    { "productId": 101, "quantity": 1, "price": 1500000 }
  ],
  "paymentMethod": "COD"
}