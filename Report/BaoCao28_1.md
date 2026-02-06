# BÁO CÁO TIẾN ĐỘ DỰ ÁN

# Ngày 28/01/2026

# Công việc đã hoàn thành

# 1. Thiết lập môi trường hệ thống

- **Cơ sở dữ liệu:** Cài đặt và cấu hình thành công **MySQL** trên macOS thông qua Homebrew. Xử lý được vấn đề phân quyền truy cập root.
- **Công cụ lập trình (IDE):** Chuyển đổi mã nguồn sang 3 IDE JetBrains bằng tài khoản Education.
  - **WebStorm** cho Frontend
  - **IntelliJ IDEA** cho Backend
  - **DataGrip** với MySQL để quản trị dữ liệu trực quan hơn

# 2. Tìm hiểu lại về CORS

- **Tìm hiểu về CORS:** Hiểu được CORS là cơ chế bảo mật giống người gác cổng xem web có được lấy dữ liệu từ miền khác không.
- **Cấu trúc dự án:** Phân tách rõ ràng luồng xử lý giữa Client-side và Server-side trong mô hình Thương mại điện tử.

# 3. Khó khăn & Vướng mắc

- **Cấu hình MySQL:** Gặp lỗi khi khởi tạo dịch vụ MySQL trên máy Mac nhưng đã xử lý bằng cách cấu hình lại `mysql_secure_installation`.
- **CORS Policy:** Gặp lỗi chặn yêu cầu khi chạy tích hợp FE và BE. Đã tìm ra phương án `app.enableCors()` trong NestJS để khắc phục.

# 4. Dự định tiếp theo

- **Thiết kế Database:**
- **Kết nối hệ thống:**

# Phần tiếp Conventional Commits, typescript-eslint

- **Conventional Commits**
- **<type>[optional scope]: <description> ** Định dạng mỗi lần sửa đổi lên git với
  - ** type ** hiểu là loại chỉnh sửa, chỉnh sửa mục đích gì : feat tạo thêm code mới, fix sửa lỗi, docs sửa báo cáo,...
  - ** optional scope ** hiểu là phạm vi chỉnh sửa ở đoạn nào
  - ** description ** mô tả xem mình đã làm gì thêm giao diện hay là sửa lỗi

- **typescript-eslint**
  - ** Công cụ sẽ chỉ ra lỗi sai ngay khi đang gõ code theo cơ thế real-time **
  - ** Lỗi sẽ hiện lên ở 3 nơi để phát hiện: Gạch chân trực tiếp ngay trên trang code, hiện trong danh sách lỗi của IDE và hiện chi tiết cụ thể lỗi sai kèm tên file, dòng nào, cột nào trong console và terminal. **
