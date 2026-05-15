# BÁO CÁO KỸ THUẬT

## Tìm hiểu về Injectable, Decorator và Dependency Injection trong NestJS

---

# 1. Dependency Injection (DI) & IoC Container

Dependency Injection (Tiêm phụ thuộc) là một Design Pattern cho phép một object nhận các object khác (dependencies) mà nó cần, thay vì tự khởi tạo chúng. Trong NestJS, cơ chế này được vận hành bởi IoC Container (Inversion of Control).

## 1.1. Cơ chế Singleton và Injection Scopes

Mặc định, NestJS sử dụng Singleton Pattern để tối ưu hiệu năng. Tuy nhiên, lập trình viên có thể thay đổi phạm vi sống của instance.

| Scope | Mô tả |
|---|---|
| DEFAULT | Một instance duy nhất được dùng chung cho toàn bộ ứng dụng (Singleton). |
| REQUEST | Một instance mới được tạo ra cho mỗi HTTP Request và bị hủy sau khi phản hồi. |
| TRANSIENT | Một instance mới được tạo ra mỗi khi nó được tiêm vào một thành phần khác. |

## 1.2. Custom Providers

Ngoài việc tiêm Class, NestJS hỗ trợ các phương thức cung cấp linh hoạt khác:

- `useValue`: Tiêm hằng số hoặc object cấu hình.
- `useFactory`: Khởi tạo dependency một cách bất đồng bộ hoặc dựa trên logic phức tạp.
- `useClass`: Hoán đổi implementation của một class, hữu ích cho Testing.

---

# 2. Bản chất của Decorator trong NestJS

Decorator là các hàm đặc biệt được ký hiệu bằng ký tự `@`, dùng để bổ sung metadata cho Class, Method, Property hoặc Parameter.

## Cơ chế Metadata

NestJS sử dụng thư viện `reflect-metadata` để đọc thông tin từ Decorator. Khi ứng dụng khởi động, framework sẽ quét các metadata này để xây dựng cây dependency và các route HTTP.

Decorator đóng vai trò rất quan trọng trong kiến trúc của NestJS vì gần như mọi thành phần trong framework đều hoạt động dựa trên metadata.

---

# 3. Vai trò của `@Injectable()`

`@Injectable()` là một decorator đánh dấu một class có thể được quản lý bởi NestJS IoC Container.

## Tại sao `@Injectable()` quan trọng?

Khi `emitDecoratorMetadata` được bật trong `tsconfig.json`, bất kỳ class nào có gắn Decorator sẽ được TypeScript lưu lại metadata về kiểu dữ liệu của các tham số trong constructor.

Nhờ đó, NestJS có thể biết class đang phụ thuộc vào những service nào để tự động khởi tạo và inject dependency tương ứng.

Nếu một Service không có `@Injectable()`, NestJS sẽ không thể xác định được dependency cần thiết, dẫn đến lỗi:

---

# 4. Tổng kết quy trình vận hành

Quy trình hoạt động của Dependency Injection trong NestJS gồm các bước:

1. **Khai báo:**  
   Sử dụng `@Injectable()` để đánh dấu Service.

2. **Đăng ký:**  
   Đưa Service vào mảng `providers` trong Module.

3. **Sử dụng:**  
   Khai báo Service trong constructor của Controller hoặc Service khác. NestJS sẽ tự động tìm instance phù hợp và inject vào.
