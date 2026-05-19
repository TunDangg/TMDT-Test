# BÁO CÁO KỸ THUẬT: CƠ CHẾ XÁC THỰC, PHÂN QUYỀN VÀ GUARDS TRONG NESTJS

## 1. Tổng quan

Chi tiết về hai khái niệm cốt lõi trong bảo mật ứng dụng web: **Authentication (Xác thực)** và **Authorization (Phân quyền)**, cùng với cách triển khai chúng trong NestJS thông qua cơ chế **Guards**.

---

## 2. Phân biệt Authentication và Authorization

Trong kỹ thuật phần mềm, "Auth" thường được dùng chung cho hai tiến trình độc lập nhưng có quan hệ mật thiết với nhau. Bảng dưới đây làm rõ sự khác biệt giữa hai khái niệm này:

| Tiêu chí | Authentication (Xác thực) | Authorization (Phân quyền) |
|---|---|---|
| Định nghĩa | Quá trình kiểm tra và xác minh danh tính của người dùng. | Quá trình kiểm tra xem người dùng có quyền truy cập vào tài nguyên không. |
| Câu hỏi cốt lõi | "Bạn là ai?" | "Bạn được phép làm gì?" |
| Thứ tự thực hiện | Luôn diễn ra trước. | Luôn diễn ra sau khi xác thực thành công. |
| Phương thức | Mật khẩu, OTP, Sinh trắc học, OAuth. | Role-based (RBAC), Permission-based (PBAC), Attribute-based (ABAC). |
| Trạng thái HTTP | Báo lỗi `401 Unauthorized` nếu thất bại. | Báo lỗi `403 Forbidden` nếu thất bại. |

---

## 3. Các loại hình Authentication phổ biến

Khi xây dựng hệ thống với NestJS, việc lựa chọn phương pháp xác thực phụ thuộc vào kiến trúc của ứng dụng (Monolith hay Microservices, SSR hay SPA). Có 3 phương pháp phổ biến nhất:

### 3.1 JSON Web Token (JWT) - Stateless Authentication

Đây là tiêu chuẩn hiện đại cho RESTful API. Server không lưu trạng thái đăng nhập; thay vào đó, cấp phát một chuỗi Token. Client lưu trữ và gửi kèm Token này trong HTTP Header:

```http
Authorization: Bearer <token>
```

ở mọi request.

### 3.2 Session/Cookie - Stateful Authentication

Đây là phương pháp truyền thống dành cho các ứng dụng Web thông thường. Server lưu thông tin phiên làm việc (Session) trong bộ nhớ hoặc Database và gửi ID của Session cho Client thông qua Cookie.

### 3.3 OAuth2.0 / OpenID Connect (SSO)

Đây là giao thức ủy quyền cho phép ứng dụng truy cập tài nguyên của người dùng thông qua một bên thứ ba như Google, Facebook hoặc Github mà không cần lưu trữ mật khẩu trực tiếp.

---

## 4. Cơ chế Guards trong NestJS

Trong kiến trúc của NestJS, Guards là các lớp (Classes) được thiết kế đặc biệt để xử lý Authorization.

### 4.1 Đặc điểm của Guards

- Được đánh dấu bằng decorator `@Injectable()` và bắt buộc phải triển khai interface `CanActivate`.
- Có duy nhất một trách nhiệm: Trả về `true` (cho phép Request đi tiếp) hoặc `false` (chặn Request và ném ra lỗi `403 Forbidden`).
- Được tích hợp sâu vào `Execution Context` của NestJS, cho phép truy cập Metadata của từng API Endpoint.

### 4.2 Khác biệt giữa Guards và Middleware

| Middleware | Guards |
|---|---|
| Hoạt động trước khi request tới Controller. | Hoạt động sau Middleware và trước Controller Handler. |
| Không biết Endpoint nào sẽ được thực thi tiếp theo. | Có thể truy cập thông tin Controller và Handler hiện tại. |
| Thường dùng cho logging, parsing, request preprocessing. | Thường dùng cho Authentication và Authorization. |

---

## 5. Quy trình triển khai Authorization (RBAC) với Guards

Để xây dựng hệ thống phân quyền dựa trên vai trò (**Role-Based Access Control - RBAC**) trong NestJS, cần kết hợp giữa **Custom Decorators** và **Guards**.

### 5.1 Custom Decorator

Decorator được sử dụng để gắn Metadata chứa Role yêu cầu cho từng Endpoint.

```ts
export const ROLES_KEY = 'roles';
```

Decorator này giúp định nghĩa các Role được phép truy cập vào API.

### 5.2 Roles Guard

Roles Guard có nhiệm vụ:

1. Đọc Metadata Role từ Decorator.
2. Lấy thông tin User từ Request.
3. So sánh Role của User với Role yêu cầu.
4. Cho phép hoặc từ chối truy cập.

Quá trình xử lý thường bao gồm:

- Trích xuất danh sách Role yêu cầu.
- Kiểm tra User hiện tại.
- Đối chiếu quyền truy cập.
- Trả về kết quả xác thực quyền.

### 5.3 Áp dụng Guards vào Controller

Guards có thể được áp dụng:

- Ở cấp độ Global.
- Ở cấp độ Controller.
- Ở cấp độ Method/Handler.

Thông thường:

- `JwtAuthGuard` dùng để xác thực Token và gắn User vào Request.
- `RolesGuard` dùng để kiểm tra quyền truy cập của User.

Quy trình hoạt động:

1. User gửi Request kèm Token.
2. `JwtAuthGuard` xác minh Token.
3. Nếu hợp lệ, thông tin User được gắn vào Request.
4. `RolesGuard` kiểm tra Role của User.
5. Nếu User có quyền phù hợp, Request được phép truy cập Endpoint.

---

## 6. Ưu điểm của Guards trong NestJS

Việc sử dụng Guards mang lại nhiều lợi ích:

- Tách biệt logic bảo mật khỏi logic nghiệp vụ.
- Dễ bảo trì và mở rộng hệ thống.
- Hỗ trợ tái sử dụng nhiều lần.
- Tuân thủ nguyên lý thiết kế SOLID.
- Tích hợp tốt với Decorators và Dependency Injection.
- Kiểm soát truy cập linh hoạt theo từng Endpoint.

---

## 7. Kết luận

Việc sử dụng Guards kết hợp với Decorators trong NestJS cung cấp một giải pháp mạnh mẽ, an toàn và dễ bảo trì để giải quyết bài toán Authentication và Authorization.

Phương pháp này không chỉ giúp tách bạch logic nghiệp vụ khỏi logic bảo mật mà còn đảm bảo mã nguồn tuân thủ chặt chẽ các nguyên lý thiết kế phần mềm hiện đại. Đồng thời, cơ chế này cũng giúp hệ thống dễ dàng mở rộng trong tương lai khi phát sinh thêm nhiều yêu cầu phân quyền phức tạp.