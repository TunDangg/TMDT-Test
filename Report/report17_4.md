# Utility Types và Decorators trong TypeScript

## 1. Giới thiệu chung

Trong hệ sinh thái TypeScript, việc tối ưu hóa mã nguồn và tăng cường tính tái sử dụng là cực kỳ quan trọng. Hai công cụ mạnh mẽ nhất hỗ trợ việc này là:

- **Utility Types**: Giúp biến đổi và tạo ra các kiểu dữ liệu mới từ các kiểu có sẵn một cách linh hoạt.
- **Decorators**: Một dạng meta-programming giúp can thiệp vào hành vi của Class và các thành phần bên trong nó mà không làm thay đổi cấu trúc logic cốt lõi.

---

## 2. Phần I: Utility Types (Các kiểu tiện ích)

### 2.1. Định nghĩa

Utility Types là các công cụ được định nghĩa sẵn trong TypeScript giúp thực hiện các phép biến đổi kiểu (Type Transformations). Thay vì phải viết lại các Interface hoặc Type mới tương tự nhau, ta sử dụng Utility Types để tái cấu trúc dữ liệu một cách thông minh.

### 2.2. Các Utility Types phổ biến

| Utility Type | Mô tả | Ứng dụng thực tế |
|-------------|------|----------------|
| **Partial\<T\>** | Chuyển tất cả thuộc tính của T thành tùy chọn (?) | Dùng cho các hàm Update (chỉ cập nhật một vài trường) |
| **Required\<T\>** | Chuyển tất cả thuộc tính thành bắt buộc | Đảm bảo dữ liệu đầu ra không được thiếu sót |
| **Readonly\<T\>** | Ngăn chặn việc gán lại giá trị cho các thuộc tính | Bảo vệ dữ liệu cấu hình hoặc hằng số |
| **Pick\<T, K\>** | Tạo một kiểu mới chỉ gồm các thuộc tính được chọn (K) | Lấy ra một phần dữ liệu cần thiết từ một Object lớn |
| **Omit\<T, K\>** | Loại bỏ các thuộc tính (K) khỏi kiểu T | Loại bỏ thông tin nhạy cảm trước khi trả về client |
| **Record\<K, T\>** | Tạo một Object với Key là K và Value là T | Định nghĩa các từ điển (dictionary) hoặc bản đồ (map) |

---

## 3. Phần II: Decorators (Trình trang trí)

### 3.1. Định nghĩa

Decorator là một hàm đặc biệt có thể gắn vào:

- Class
- Phương thức (Method)
- Thuộc tính (Property)
- Tham số (Parameter)

Nó sử dụng cú pháp `@expression`.

**Lưu ý:** Để sử dụng Decorator, bạn cần bật `"experimentalDecorators": true` trong file `tsconfig.json`.

---

### 3.2. Phân loại Decorators

#### A. Class Decorator

Dùng để quan sát hoặc thay đổi định nghĩa của một Class.

#### B. Method Decorator

Dùng để can thiệp vào quá trình thực thi của một hàm. Thường dùng để log dữ liệu hoặc kiểm tra quyền.

#### C. Property Decorator

Dùng để theo dõi hoặc thay đổi hành vi của thuộc tính.

---

### 3.3. Tại sao nên sử dụng Decorators?

- **Separation of Concerns**: Tách biệt logic bổ trợ (logging, validation) khỏi logic nghiệp vụ chính.
- **Clean Code**: Giúp code ngắn gọn, mang tính tuyên bố (declarative).
- **Tính tái sử dụng**: Một Decorator có thể áp dụng cho nhiều nơi khác nhau mà không cần sửa code bên trong.

---

## 4. Tổng kết so sánh

| Đặc điểm | Utility Types | Decorators |
|----------|-------------|------------|
| **Mục tiêu** | Biến đổi kiểu dữ liệu (Static Analysis) | Thay đổi hành vi (Runtime Logic) |
| **Thời điểm thực hiện** | Lúc Compile (biên dịch) | Lúc Runtime (thực thi) |
| **Vị trí tác động** | Interface, Type, Aliases | Class, Method, Property, Parameter |
| **Lợi ích chính** | Đảm bảo an toàn kiểu (Type-safety) | Tính đóng gói và mở rộng logic |

---

## 5. Kết luận

Việc kết hợp thành thạo Utility Types và Decorators giúp lập trình viên TypeScript viết code chuyên nghiệp hơn, giảm thiểu lỗi và tăng khả năng bảo trì hệ thống.