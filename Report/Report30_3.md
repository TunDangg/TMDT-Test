# Kiến Thức Lập Trình: Event Loop & Vue 3 Communication

Tài liệu tóm tắt các khái niệm nền tảng về cơ chế vận hành của JavaScript và cách giao tiếp giữa các Component trong Vue 3.

---

## I. Event Loop (Cơ chế điều phối trong JavaScript)

### 1. Khái niệm và Vai trò
Hãy tưởng tượng **Event Loop** như một "người điều phối giao thông" tận tụy trong trình duyệt hoặc Node.js.

* **Định nghĩa:** Là cơ chế cho phép JavaScript thực hiện các thao tác **non-blocking I/O** (không gây tắc nghẽn).
* **Đặc điểm:** Mặc dù JavaScript là đơn luồng (single-threaded) — tại một thời điểm chỉ làm được đúng một việc — nhưng nhờ Event Loop, nó có thể "gửi gắm" các việc nặng (như tải ảnh, gọi API, đợi timer) cho hệ thống bên dưới (Web APIs) xử lý, còn bản thân nó thì tiếp tục chạy các dòng code khác.
* **Mục đích chính:**
    * **Giữ cho ứng dụng luôn mượt mà:** Tránh việc trình duyệt bị "đơ" khi đang chờ dữ liệu từ server.
    * **Tối ưu hóa tài nguyên:** Xử lý hàng ngàn kết nối cùng lúc (đặc biệt quan trọng với **NestJS**) mà không cần tạo ra hàng ngàn luồng (thread) gây tốn RAM.

### 2. Mối quan hệ với Async và Await
`async/await` thực chất không thay đổi cách Event Loop hoạt động, nó chỉ là cú pháp giúp chúng ta điều khiển Event Loop một cách dễ đọc hơn.

* **Khi gặp `async`:** Báo hiệu cho JavaScript rằng hàm này sẽ trả về một **Promise** (một lời hứa sẽ có kết quả trong tương lai).
* **Khi gặp `await`:** Ra lệnh cho hàm đó: *"Hãy tạm dừng ở đây và nhường chỗ cho các việc khác trong Stack chạy trước đi. Khi nào cái Promise này xong thì hãy quay lại thực hiện tiếp phần code bên dưới tôi."*

**Luồng đi trong Event Loop:**
1.  Khi `await` được kích hoạt, phần code phía sau nó sẽ được đóng gói lại và đẩy vào một hàng đợi đặc biệt gọi là **Microtask Queue**.
2.  **Event Loop** sẽ ưu tiên quét sạch cái Microtask Queue này ngay sau khi **Call Stack** (các lệnh đồng bộ) vừa trống, và trước khi nó xử lý các tác vụ như `setTimeout` (Macrotask).

---

## II. Giao tiếp giữa các Component trong Vue 3

Trong Vue 3 (Composition API), việc truyền dữ liệu tuân thủ nguyên tắc: **Props Down, Events Up**.

### 1. `defineProps` (Nhận dữ liệu)
`defineProps` là một macro được sử dụng trong component con để khai báo các "props" (thuộc tính) mà nó mong muốn nhận được từ component cha. Đây là cách dữ liệu đi từ trên xuống dưới.

* **Đặc điểm:** Props là **"read-only"** (chỉ đọc). Component con không được phép thay đổi trực tiếp giá trị của prop để đảm bảo tính nhất quán của dữ liệu.

### 2. `defineEmits` (Gửi tín hiệu/dữ liệu lên)
`defineEmits` (thường được gọi tắt là **emit**) được sử dụng để gửi sự kiện từ component con ngược lên component cha. Đây là cách giao tiếp từ dưới lên trên.

* **Cách hoạt động:** Con "phát" (emit) một sự kiện kèm theo dữ liệu (nếu có), và cha sẽ "lắng nghe" sự kiện đó bằng directive `v-on` (hoặc ký hiệu `@`).

---

*Tài liệu được hệ thống lại bởi Đăng phục vụ cho dự án TMDT-Test.*