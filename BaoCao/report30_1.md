# BÁO CÁO TIẾN ĐỘ DỰ ÁN
# Ngày 30/01/2026

## 1. Công việc đã hoàn thành
- **Xây dựng UI/UX:** Thiết kế và triển khai giao diện trang CheckOutView (Thanh toán) cho module quản lý đơn hàng.
- **Tích hợp API:** Thực hiện kết nối dữ liệu thực từ Backend lên giao diện Frontend, thay thế toàn bộ dữ liệu mẫu (mock data) cho danh mục sản phẩm.
- **Quản lý mã nguồn:** Áp dụng tiêu chuẩn Conventional Commits để quản lý lịch sử commit và sử dụng **ESLint** để chuẩn hóa chất lượng code.

## 2. Kết quả đạt được
- Luồng dữ liệu hoạt động ổn định từ MySQL thông qua API và hiển thị chính xác lên giao diện người dùng.
- Giao diện trang CheckOutView được hoàn thiện cơ bản đúng theo layout yêu cầu, đảm bảo tính thẩm mỹ.

## 3. Khó khăn & Vướng mắc
- Gặp một số lỗi xung đột nhỏ trong cấu hình ESLint khi làm việc với các component Vue3 nhưng đã xử lý xong.
- Việc mapping kiểu dữ liệu giữa Backend và Frontend cần sự chính xác cao để tránh lỗi runtime.
- Một số code chưa hiểu, sẽ tìm hiểu thêm để giải đáp

## 4. Dự định tiếp theo
- Hoàn thiện trang thanh toán: Phát triển tính năng nhập thông tin cá nhân bắt buộc trước khi xác nhận đặt hàng.
- Tìm hiểu về khi nhấn thanh toán sẽ hiện Qr nếu người mua hàng muốn thanh toán trực tuyến.
- Tích hợp các thông báo trạng thái (Toast/Alert) để tăng trải nghiệm người dùng.