<script setup>
import { ref, onMounted } from 'vue' // Thêm onMounted
import ProductCard from '../components/ProductCard.vue'
import { useCartStore } from '../stores/cart'
import axios from 'axios' // Bước A: Import axios

const cart = useCartStore()

// Để mảng trống ban đầu
const products = ref([])
const backendInfo = ref(null) // Để lưu thông tin "IT Intern"

// Bước B: Gọi API khi trang vừa mở
onMounted(async () => {
  try {
    // 1. Lấy thông tin chào mừng (cổng 3000)
    const resInfo = await axios.get('http://localhost:3000')
    backendInfo.value = resInfo.data

    // 2. Tạm thời dùng lại dữ liệu cũ nhưng gán qua API (sau này bạn sẽ viết API /products bên Nest)
    products.value = [
      { id: 1, name: 'Trà Sữa (từ Nest)', price: 50000 },
      { id: 2, name: 'Gà Rán (từ Nest)', price: 50000 },
      { id: 3, name: 'Pizza (từ Nest)', price: 150000 },
      { id: 4, name: 'Mì Cay (từ Nest)', price: 65000 },
      { id: 5, name: 'Tokbokki (từ Nest)', price: 65000 },
    ]
  } catch (error) {
    console.error('Lỗi kết nối Backend', error)
  }
})

// Các phần style giữ nguyên...
const containerStyle = { display: 'flex', gap: '20px' }
const productStyle = { flex: '2', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }
const cartSummaryStyle = { flex: '1', background: '#f9f9f9', padding: '20px' }
</script>

<template>
  <div class="home">
    <h1>Cửa Hàng Đồ Ăn Nhanh</h1>

    <div
      v-if="backendInfo"
      style="background: #e3f2fd; padding: 10px; border-radius: 5px; margin-bottom: 10px"
    >
      <p>{{ backendInfo.message }}</p>
      <p>Lập trình viên: {{ backendInfo.user }} - {{ backendInfo.role }}</p>
    </div>

    <div :style="containerStyle">
      <div class="products" :style="productStyle">
        <ProductCard v-for="p in products" :key="p.id" :product="p" @add-to-cart="cart.addToCart" />
      </div>

      <div class="cart-summary" :style="cartSummaryStyle">
        <h2>Giỏ hàng ({{ cart.totalItems }})</h2>
        <div v-for="item in cart.items" :key="item.id">{{ item.name }} x {{ item.quantity }}</div>
        <hr />
        <p>
          <strong>Tổng cộng: {{ cart.totalPrice }}đ</strong>
        </p>
      </div>
    </div>
  </div>
</template>

###Việc bạn tách biệt dữ liệu như thế này rất sát với thực tế dự án **Clinic Management System** hay
**Lead Management** **Frontend (Vue3)**: Chỉ lo việc vẽ giao diện và bắt sự kiện người dùng. *
**Backend (NestJS)**: Quản lý toàn bộ thông tin sản phẩm, giá cả và thông tin người dùng. ** Nếu khi
chạy `npm run dev` mà bạn thấy chữ "IT Intern" hiện lên trên giao diện bán hàng, nghĩa là bạn đã
hoàn thành xuất sắc việc kết nối Fullstack đầu tiên của mình!
