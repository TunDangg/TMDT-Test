# JSON Web Token và DEPENDENCY INJECTION


---

## 1. JSON Web Token (JWT)

### 1.1. Định nghĩa
**JSON Web Token (JWT)** là một phương thức truyền tin an toàn giữa các bên dưới dạng một đối tượng JSON. Thông tin này được tin cậy vì nó có chữ ký kỹ thuật số (digitally signed).

### 1.2. Cấu trúc (Structure)
Một chuỗi JWT bao gồm 3 phần, được phân tách bởi dấu chấm (`.`):

1.  **Header:** Chứa loại token (JWT) và thuật toán mã hóa (ví dụ: HS256).
2.  **Payload:** Chứa các thông tin cần truyền tải (Claims), chẳng hạn như `userId`, `role`, hoặc thời gian hết hạn (`exp`).
3.  **Signature:** Phần chữ ký được tạo ra bằng cách kết hợp Header, Payload với một Secret Key phía Server để đảm bảo dữ liệu không bị thay đổi.

### 1.3. Luồng hoạt động chính
1.  **Đăng nhập:** Client gửi thông tin đăng nhập.
2.  **Khởi tạo:** Server xác thực thành công và tạo JWT bằng Secret Key.
3.  **Lưu trữ:** Client nhận JWT và lưu vào LocalStorage hoặc Cookie.
4.  **Xác thực:** Trong các request sau, Client gửi JWT trong Header `Authorization: Bearer <token>`. Server chỉ cần giải mã token để nhận diện người dùng mà không cần truy vấn Session.

---

## 2. Dependency Injection 

### 2.1. Khái niệm
**Dependency Injection** là một Design Pattern thuộc nhóm Inversion of Control (IoC). Thay vì một lớp tự khởi tạo các đối tượng phụ thuộc (dependencies) của nó, các đối tượng này sẽ được "bơm" vào từ bên ngoài (thường là qua hàm khởi tạo).

### 2.2. Lợi ích cốt lõi
* **Loose Coupling (Liên kết lỏng lẻo):** Giảm sự phụ thuộc cứng nhắc giữa các module.
* **Dễ bảo trì:** Khi thay đổi logic của một service, ta không cần sửa đổi code ở các lớp sử dụng service đó.
* **Testability:** Dễ dàng thay thế các service thật bằng các đối tượng giả (Mock/Stub) khi thực hiện Unit Test.

### 2.3. Ví dụ minh họa (NestJS/TypeScript)
Thay vì tự khởi tạo Service trong Controller:

```typescript
// Không dùng DI (Tight Coupling)
class ProductController {
  private productService = new ProductService();
}

// Có dùng DI (Loose Coupling)
@Injectable()
class ProductController {
  constructor(private readonly productService: ProductService) {}
}