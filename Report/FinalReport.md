# BÁO CÁO DỰ ÁN THƯƠNG MẠI ĐIỆN TỬ (TMDT-Test)

## 1. Mục tiêu dự án
Xây dựng một hệ thống website thương mại điện tử hoàn chỉnh, phân tách rõ ràng luồng xử lý giữa Client-side. Dự án nhằm mục đích ứng dụng các công nghệ web hiện đại vào quy trình quản lý sản phẩm, giỏ hàng, đơn hàng và quản lý tệp khách hàng tiềm năng.

## 2. Công nghệ và Môi trường phát triển
Dự án được xây dựng trên nền tảng kiến trúc hiện đại, kết hợp các thư viện mạnh mẽ để tối ưu hóa hiệu năng và trải nghiệm người dùng:

* **Frontend (Client-side):**
    * **Core:** Khung ứng dụng chính được xây dựng bằng **Vue 3** kết hợp **TypeScript** và công cụ build **Vite** giúp khởi chạy và đóng gói dự án nhanh chóng.
    * **UI/UX & Styling:** Sử dụng **Tailwind CSS** để thiết kế giao diện linh hoạt, tích hợp thư viện icon **Lucide Vue Next**.
    * **Quản lý State & Routing:** Sử dụng **Pinia** để quản lý trạng thái tập trung (giỏ hàng, tìm kiếm) và **Vue Router** để điều hướng trang cơ bản (SPA).
    * **Giao tiếp API & Tiện ích:** Tích hợp **Axios** để xử lý các HTTP request tới server và **Vue Toastification** để hiển thị các thông báo (toast) tương tác với người dùng một cách trực quan.
    * **Kiểm soát chất lượng mã:** Cấu hình **ESLint** và **Prettier** để đảm bảo code convention đồng nhất.
* **Backend (Server-side):**
    * **Core:** Xây dựng trên framework **NestJS** và **TypeScript**, cung cấp cấu trúc module hóa chuẩn xác.
    * **Cơ sở dữ liệu:** Sử dụng hệ quản trị **MySQL** kết nối qua driver `mysql2`, thao tác dữ liệu thông qua ORM mạnh mẽ là **TypeORM**.
    * **Bảo mật & Xác thực:** Tích hợp **JWT** (`@nestjs/jwt`) và **Passport** (`passport-jwt`) để cấp phát và quản lý token đăng nhập. Mật khẩu người dùng được mã hóa an toàn bằng thư viện **Bcrypt**.
    * **Kiểm tra dữ liệu (Validation):** Sử dụng `class-validator` và `class-transformer` để kiểm tra tính hợp lệ và định dạng của dữ liệu đầu vào từ Client gửi lên (Data Transfer Objects).
    * **Kiểm thử (Testing):** Tích hợp sẵn framework **Jest** và **Supertest** phục vụ cho việc viết Unit test và E2E test cho API.
* **Công cụ & Môi trường:**
    * **IDE:** Hệ sinh thái JetBrains (WebStorm cho Frontend, IntelliJ IDEA cho Backend, DataGrip cho Database).
    * **Môi trường:** Triển khai trên macOS thông qua Homebrew.

## 3. Cấu trúc hệ thống và Tính năng chính
Hệ thống được chia thành hai phần rõ rệt (Client-side và Server-side) với kiến trúc module hóa chặt chẽ.

### 3.1. Kiến trúc Frontend (Vue 3)
Frontend được tổ chức theo chuẩn của một ứng dụng Vue 3 hiện đại, phân tách rõ ràng giữa giao diện, trạng thái và kết nối API:
* **`src/assets/`**: Chứa các tệp tĩnh (ví dụ: `main.css`).
* **`src/components/`**: Các thành phần UI có thể tái sử dụng (`AdminSidebar.vue`, `CartSidebar.vue`, `ProductCard.vue`).
* **`src/router/`**: Cấu hình Vue Router điều hướng trang (`index.ts`).
* **`src/services/`**: Xử lý logic gọi API gửi tới Backend (`api.ts`).
* **`src/stores/`**: Quản lý trạng thái (State management) bằng Pinia (`cart.ts`, `search.ts`).
* **`src/views/`**: Các trang giao diện chính (Pages), được chia thành hai nhóm:
    * **Khách hàng (Client):** `HomeView`, `CheckOutView`, `LoginView`, `RegisterView`, `ProfileView`. Cung cấp trải nghiệm mua sắm, tìm kiếm, quản lý giỏ hàng và thanh toán.
    * **Quản trị (Admin):** `AdminView`, `ProductManagementView`, `OrderManagementView`, `LeadManagementView`. Khu vực dành riêng cho quản lý nghiệp vụ.

### 3.2. Kiến trúc Backend (NestJS)
Backend áp dụng kiến trúc Module hóa chặt chẽ của NestJS. Mỗi tính năng được đóng gói thành một thư mục riêng biệt:
* **Cấu trúc lõi:** `app.module.ts` (Root Module) và `main.ts` (Điểm khởi chạy server, cấu hình CORS).
* **Các Module chính (`src/`):** `auth/`, `users/`, `products/`, `cart/`, `orders/`, `leads/`.
* **Thành phần trong mỗi Module:**
    * **Controller (`*.controller.ts`):** Nhận request từ client, điều hướng đến Service xử lý và trả về response.
    * **Service (`*.service.ts`):** Chứa business logic (logic nghiệp vụ) và thao tác với Database.
    * **Entity (`entities/`):** Định nghĩa cấu trúc bảng trong cơ sở dữ liệu MySQL.
    * **DTO (`dto/`):** Định nghĩa khuôn mẫu dữ liệu đầu vào (Data Transfer Object) để validate dữ liệu từ Client gửi lên.

### 3.3. Các tính năng và Module cốt lõi
Hệ thống cung cấp các tính năng chính sau, kết hợp chặt chẽ giữa logic Frontend và Backend:
* **Bảo mật, Xác thực & Phân quyền (Auth/Users):** * Tính năng đăng ký, đăng nhập an toàn: Mật khẩu được băm (hash) bằng **Bcrypt** trước khi lưu vào DB.
    * Quản lý phiên bản người dùng bằng **JWT** (JSON Web Token), kết hợp `passport-jwt` để bảo vệ các route nhạy cảm.
    * Hệ thống phân quyền rõ ràng (Role-based Guard) thông qua `auth.guard.ts` và `roles.guard.ts` giữa người dùng thường và Quản trị viên (Admin).
* **Trải nghiệm người dùng (UI/UX):** * Giao diện tương tác mượt mà nhờ hệ thống thông báo trạng thái realtime sử dụng **Vue Toastification**.
    * Dữ liệu nhập vào từ form phía Client được gửi qua **Axios** và được Backend xác thực chặt chẽ (Validation) thông qua `class-validator`.
* **Quản lý Sản phẩm (Products):** Hiển thị danh sách sản phẩm, chi tiết sản phẩm. Admin có toàn quyền quản trị (thêm mới, chỉnh sửa, xóa) các mặt hàng lưu trữ trong MySQL thông qua **TypeORM**.
* **Giỏ hàng & Thanh toán (Cart & Orders):** * Tính năng giỏ hàng lưu trạng thái cục bộ linh hoạt bằng **Pinia**, tính toán tổng chi phí và tiến hành checkout.
    * Tạo mới đơn hàng và lưu trữ lịch sử giao dịch vào cơ sở dữ liệu. Module Orders được thiết kế liên kết chặt chẽ với bảng sản phẩm và chi tiết đơn hàng (`order-item.entity.ts`).
* **Quản lý Khách hàng tiềm năng (Leads):** Tính năng theo dõi và quản lý dữ liệu (CRM nội bộ cơ bản) cho các khách hàng có tiềm năng.
* **Giao diện Quản trị (Admin Dashboard):** Bảng điều khiển riêng biệt tích hợp `AdminSidebar` giúp Admin theo dõi toàn bộ hoạt động của website.

## 4. Các khó khăn và Giải pháp kỹ thuật
Trong quá trình phát triển hệ thống, dự án đã đối mặt và giải quyết các bài toán kỹ thuật sau:

* **Thiết lập và phân quyền Cơ sở dữ liệu:**
    * **Vấn đề:** Quá trình khởi tạo dịch vụ MySQL trên máy Mac gặp lỗi liên quan đến phân quyền truy cập root.
    * **Giải pháp:** Tiến hành cấu hình lại thông qua lệnh `mysql_secure_installation` để thiết lập lại mật khẩu và cấp quyền thành công, đảm bảo tính bảo mật cho môi trường dev.
* **Chính sách bảo mật CORS giữa Frontend và Backend:**
    * **Vấn đề:** Khi tích hợp Frontend (chạy trên cổng của Vite) và Backend (chạy trên cổng của NestJS), trình duyệt đã chặn các yêu cầu API do vi phạm chính sách Same-Origin.
    * **Giải pháp:** Sau khi tìm hiểu chuyên sâu về cơ chế bảo mật CORS, vấn đề đã được khắc phục hoàn toàn bằng cách cấu hình phương thức `app.enableCors()` ở phía server NestJS để cấp quyền truy cập hợp lệ cho domain của Client-side.