# Express.js & Authentication

---

## 1. Express.js (Trong bối cảnh sử dụng NestJS)

Mặc dù dự án backend đang sử dụng framework **NestJS**, nhưng nền tảng cốt lõi thực thi các request HTTP bên dưới vẫn là **Express.js**. Việc hiểu Express.js giúp nắm bắt được cách dòng chảy dữ liệu hoạt động:

### 1.1. Vòng đời Request - Response
- **Client (Vue.js)** gửi một HTTP Request (GET, POST, PUT, DELETE) lên Server.
- Server (NestJS/Express) tiếp nhận, xử lý logic, tương tác với Database.
- Server trả về HTTP Response kèm theo **Status Code** (VD: `200 OK`, `201 Created`, `401 Unauthorized`, `500 Internal Server Error`).

### 1.2. Middleware
- Là các hàm trung gian can thiệp vào giữa quá trình nhận Request và trả về Response.
- **Vai trò trong dự án:** Rất quan trọng trong việc xác thực (Authentication). Middleware sẽ làm nhiệm vụ "người gác cổng", kiểm tra xem Request gửi lên có chứa Token hợp lệ hay không trước khi cho phép truy cập vào Controller.

---

## 2. Authentication

Đối với hệ thống E-commerce, cơ chế xác thực được lựa chọn là **JWT (JSON Web Token)** kết hợp với thư viện **Passport.js**. Đây là cơ chế *Stateless* (không lưu phiên đăng nhập trên server), rất phù hợp để làm RESTful API giao tiếp với Vue.js.

### 2.1. Các thư viện Backend (NestJS) sử dụng:
- `@nestjs/jwt`: Dùng để tạo và xác thực token.
- `passport-jwt`: Dùng để xây dựng các Guard (bảo vệ API).
- `bcrypt`: Băm (hash) mật khẩu để bảo mật dữ liệu người dùng trong Database.

### 2.2. Luồng hoạt động (Authentication Flow):

#### A. Luồng Đăng ký (Register)
1. User nhập email và password từ frontend.
2. Backend nhận dữ liệu, sử dụng `bcrypt` để mã hóa mật khẩu (ví dụ từ `123456` thành một chuỗi băm ngẫu nhiên).
3. Lưu thông tin user cùng mật khẩu đã băm vào Database.

#### B. Luồng Đăng nhập (Login)
1. User gửi email và password lên Backend.
2. Backend tìm user trong Database bằng email.
3. Dùng `bcrypt.compare()` để so sánh password gửi lên với password đã băm trong Database.
4. Nếu hợp lệ, hệ thống dùng `@nestjs/jwt` tạo ra một chuỗi **Access Token** (chứa thông tin cơ bản như `userId` và thời hạn sống của token) trả về cho Client.

#### C. Luồng truy cập API cần bảo mật (Authorization)
1. Ở các API cần bảo mật (ví dụ: Xem giỏ hàng, Thanh toán), backend sẽ gắn `AuthGuard`.
2. Frontend khi gọi các API này bắt buộc phải gửi kèm Token ở HTTP Header: `Authorization: Bearer <Token>`.
3. Guard của NestJS sẽ xác minh Token, nếu đúng mới cho phép chạy tiếp, nếu sai trả về lỗi `401 Unauthorized`.

---

## 3. Tích hợp phía Frontend (Vue.js)

Để kết nối với cơ chế Auth của Backend, phía Frontend cần xử lý 3 vấn đề chính:

1. **Lưu trữ Token:** Khi API Login trả về Token, lưu nó vào State (Pinia) để các component sử dụng, đồng thời lưu vào `localStorage` hoặc `Cookies` để giữ trạng thái đăng nhập khi f5 lại trang.
2. **Axios Interceptors:** Cấu hình Axios tự động bắt (intercept) mọi request chuẩn bị gửi đi và nhét Token vào Header, tránh việc phải code tay ở từng file gọi API.
3. **Navigation Guards (Vue Router):** Sử dụng `router.beforeEach` để chặn user truy cập vào các trang như `/checkout` hay `/admin` nếu kiểm tra thấy chưa có Token.

