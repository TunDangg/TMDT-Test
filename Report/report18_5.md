# BÁO CÁO TÌM HIỂU
# CÁC KHÁI NIỆM LẬP TRÌNH CỐT LÕI VÀ CÔNG CỤ KIỂM THỬ POSTMAN

---

# Phần 1: Lời mở đầu

Báo cáo này nhằm mục đích hệ thống hóa các khái niệm nền tảng trong phát triển phần mềm, bao gồm các thành phần cấu trúc mã nguồn cơ bản như Biến (Variable), Giá trị (Value), Hàm (Function), Đối tượng (Object) và phương thức giao tiếp giữa các hệ thống thông qua API.

Đồng thời, báo cáo cung cấp cái nhìn tổng quan về công cụ Postman và vai trò của nó trong quy trình kiểm thử, phát triển và vận hành hệ thống phần mềm hiện đại.

---

# Phần 2: Các thành phần cốt lõi trong lập trình

## 2.1. Biến (Variable) và Giá trị (Value)

### Định nghĩa

#### Biến (Variable)

Biến là một định danh (tên) đại diện cho một vùng nhớ trong máy tính, được cấp phát để lưu trữ dữ liệu trong quá trình chương trình thực thi.

#### Giá trị (Value)

Giá trị là phần dữ liệu thực tế được gán và lưu trữ bên trong vùng nhớ của biến đó, ví dụ như:

- Chuỗi văn bản
- Số nguyên
- Số thực
- Giá trị Boolean
- Mảng dữ liệu
- Đối tượng dữ liệu

### Tính chất

Giá trị của biến có thể thay đổi trong suốt vòng đời của chương trình, giúp xử lý các luồng logic động và linh hoạt.

### Vai trò

- Lưu trữ dữ liệu tạm thời
- Hỗ trợ xử lý dữ liệu trong chương trình
- Tạo tính linh hoạt cho hệ thống phần mềm

---

## 2.2. Hàm (Function)

### Định nghĩa

Hàm là một tập hợp các câu lệnh được đóng gói lại thành một khối độc lập nhằm thực hiện một nhiệm vụ cụ thể.

### Cơ chế hoạt động

#### Đầu vào (Input)

Nhận các tham số (`parameters`) từ người dùng hoặc hệ thống.

#### Xử lý (Process)

Thực thi các logic tính toán và xử lý dữ liệu bên trong hàm.

#### Đầu ra (Output)

Trả về kết quả (`return`) sau khi hoàn tất xử lý.

### Lợi ích

- Tối ưu hóa mã nguồn
- Tăng khả năng tái sử dụng (reusability)
- Giảm trùng lặp code
- Dễ bảo trì và nâng cấp hệ thống
- Giúp chương trình có cấu trúc rõ ràng và khoa học hơn

---

## 2.3. Đối tượng (Object)

### Định nghĩa

Đối tượng là một cấu trúc dữ liệu phức hợp dùng để mô phỏng một thực thể thực tế hoặc một khái niệm logic trong hệ thống.

Đối tượng giúp gom nhóm các dữ liệu và hành vi có liên quan chặt chẽ với nhau.

### Thành phần cấu tạo

#### Thuộc tính (Properties)

Là các biến gắn liền với đối tượng, mô tả trạng thái hoặc đặc điểm của đối tượng đó.

#### Phương thức (Methods)

Là các hàm được định nghĩa bên trong đối tượng, mô tả các hành động mà đối tượng có thể thực hiện.

### Vai trò

- Mô hình hóa dữ liệu trong hệ thống
- Hỗ trợ lập trình hướng đối tượng (OOP)
- Tăng tính tổ chức cho mã nguồn
- Hỗ trợ mở rộng và tái sử dụng chương trình

---

# Phần 3: Giao diện lập trình ứng dụng (API)

## 3.1. Định nghĩa API

API (Application Programming Interface) là tập hợp các quy tắc và cơ chế cho phép các ứng dụng phần mềm độc lập giao tiếp và trao đổi dữ liệu với nhau.

API đóng vai trò như cầu nối giữa các hệ thống, giúp việc truyền nhận dữ liệu diễn ra đồng bộ và hiệu quả hơn.

---

## 3.2. Mô hình Client - Server

Trong phát triển phần mềm hiện đại, API thường hoạt động theo mô hình Client - Server.

### Client (Frontend)

Là các ứng dụng phía người dùng như:

- Website
- Ứng dụng Mobile
- Desktop Application

Client gửi yêu cầu (`Request`) tới hệ thống.

### API

Đóng vai trò trung gian tiếp nhận yêu cầu từ Client, chuyển đến máy chủ xử lý và trả dữ liệu phản hồi.

### Server (Backend)

Là hệ thống xử lý logic nghiệp vụ và truy xuất cơ sở dữ liệu để tạo ra phản hồi (`Response`).

### Vai trò của API

- Kết nối Frontend và Backend
- Đồng bộ dữ liệu giữa các hệ thống
- Hỗ trợ tích hợp dịch vụ bên thứ ba
- Tăng khả năng mở rộng hệ thống

---

# Phần 4: Tổng quan và ứng dụng của Postman

## 4.1. Khái niệm Postman

Postman là một nền tảng chuyên dụng dùng để phát triển, quản lý và kiểm thử API.

Đối với các kỹ sư phát triển phần mềm, Postman đóng vai trò như một Client giả lập, cho phép gửi các HTTP Request trực tiếp đến máy chủ Backend để kiểm tra tính chính xác của dữ liệu phản hồi mà không cần xây dựng hoàn thiện giao diện Frontend.

### Vai trò của Postman

- Kiểm thử API nhanh chóng
- Debug lỗi hệ thống
- Kiểm tra dữ liệu phản hồi
- Quản lý API hiệu quả
- Hỗ trợ làm việc nhóm
- Tự động hóa quy trình kiểm thử

---

## 4.2. Cấu trúc một HTTP Request trong Postman

Để thực hiện một yêu cầu tới máy chủ, người dùng cần cấu hình các thành phần sau:

| Thành phần | Ý nghĩa & Chức năng |
|---|---|
| URL | Địa chỉ Endpoint của tài nguyên trên hệ thống |
| Method | Phương thức thao tác dữ liệu |
| Headers | Chứa metadata như Authorization hoặc Content-Type |
| Body | Dữ liệu gửi lên máy chủ, thường ở định dạng JSON |

---

## 4.3. Các phương thức HTTP phổ biến

| Method | Chức năng |
|---|---|
| GET | Lấy dữ liệu |
| POST | Tạo mới dữ liệu |
| PUT | Cập nhật toàn bộ dữ liệu |
| PATCH | Cập nhật một phần dữ liệu |
| DELETE | Xóa dữ liệu |

---

## 4.4. Phân tích HTTP Response từ Postman

Sau khi gửi Request, Postman sẽ hiển thị kết quả do máy chủ trả về.

### Thành phần của Response

#### Body (Dữ liệu trả về)

Chứa dữ liệu phản hồi hoặc thông báo lỗi từ hệ thống, thường ở định dạng JSON.

#### Time (Thời gian phản hồi)

Cho biết thời gian hệ thống xử lý Request.

#### Size (Kích thước dữ liệu)

Hiển thị dung lượng dữ liệu phản hồi.

#### Status Code (Mã trạng thái)

Mã chuẩn hóa quốc tế báo hiệu trạng thái xử lý của hệ thống.

---

## 4.5. Các nhóm mã trạng thái HTTP

### Nhóm 1xx: Informational (Thông tin)

Yêu cầu đã được tiếp nhận, quá trình xử lý đang tiếp tục. Nhóm này mang tính chất thông báo trạng thái giao tiếp tạm thời.

| Mã trạng thái | Ý nghĩa |
|---|---|
| 100 Continue | Máy chủ đã nhận phần đầu yêu cầu, máy khách có thể tiếp tục gửi dữ liệu |
| 101 Switching Protocols | Máy chủ chấp thuận yêu cầu chuyển đổi giao thức mạng |

---

### Nhóm 2xx: Success (Thành công)

Yêu cầu của máy khách đã được máy chủ tiếp nhận, hiểu và xử lý hợp lệ.

| Mã trạng thái | Ý nghĩa |
|---|---|
| 200 OK | Xử lý thành công và trả về dữ liệu yêu cầu |
| 201 Created | Xử lý thành công và tài nguyên mới được tạo |
| 204 No Content | Xử lý thành công nhưng không cần trả dữ liệu |

---

### Nhóm 3xx: Redirection (Chuyển hướng)

Máy khách cần thực hiện thêm thao tác để hoàn tất yêu cầu. Hệ thống thông báo tài nguyên đã thay đổi vị trí.

| Mã trạng thái | Ý nghĩa |
|---|---|
| 301 Moved Permanently | Tài nguyên đã chuyển vĩnh viễn sang địa chỉ mới |
| 302 Found | Tài nguyên tạm thời chuyển sang địa chỉ khác |
| 304 Not Modified | Dữ liệu chưa thay đổi, có thể sử dụng cache |

---

### Nhóm 4xx: Client Error (Lỗi phía máy khách)

Lỗi xảy ra do yêu cầu không hợp lệ từ phía máy khách.

| Mã trạng thái | Ý nghĩa |
|---|---|
| 400 Bad Request | Yêu cầu sai định dạng hoặc không hợp lệ |
| 401 Unauthorized | Thiếu hoặc sai thông tin xác thực |
| 403 Forbidden | Không có quyền truy cập tài nguyên |
| 404 Not Found | Không tìm thấy tài nguyên |
| 405 Method Not Allowed | Phương thức không được hỗ trợ |

---

### Nhóm 5xx: Server Error (Lỗi phía máy chủ)

Yêu cầu từ máy khách hợp lệ nhưng máy chủ gặp lỗi trong quá trình xử lý.

| Mã trạng thái | Ý nghĩa |
|---|---|
| 500 Internal Server Error | Lỗi hệ thống hoặc lỗi logic phía máy chủ |
| 502 Bad Gateway | Máy chủ trung gian nhận phản hồi không hợp lệ |
| 503 Service Unavailable | Hệ thống quá tải hoặc đang bảo trì |
| 504 Gateway Timeout | Máy chủ vượt quá thời gian chờ phản hồi |

---

# Phần 5: Kết luận

Các khái niệm như Biến, Hàm, Đối tượng và API là nền tảng quan trọng trong phát triển phần mềm hiện đại. Việc hiểu rõ các thành phần này giúp lập trình viên xây dựng hệ thống hiệu quả, dễ mở rộng và dễ bảo trì hơn.

Bên cạnh đó, Postman là công cụ hỗ trợ mạnh mẽ trong việc phát triển và kiểm thử API, giúp giảm thời gian debug, tối ưu quy trình làm việc và nâng cao chất lượng hệ thống.

Thông qua việc tìm hiểu các kiến thức trên, có thể thấy rằng API và các công cụ kiểm thử đóng vai trò vô cùng quan trọng trong mô hình phát triển phần mềm hiện đại, đặc biệt đối với các hệ thống Web Application và Mobile Application.

---