<script setup lang="ts">
/* --- PHẦN IMPORT: Khai báo các công cụ sẽ sử dụng --- */
// ref: Tạo biến phản ứng (đổi giá trị là giao diện đổi theo).
// onMounted: Chạy code ngay sau khi trang web hiển thị xong.
// watch: Theo dõi một biến, nếu biến đó đổi thì chạy một hành động nào đó.
import { ref, onMounted, watch } from 'vue' // Import các hàm cốt lõi của Vue 3
import ProductCard from '../components/ProductCard.vue' // Import component thẻ sản phẩm để hiển thị
import { useCartStore } from '../stores/cart' // Import kho quản lý giỏ hàng (Pinia)
import { useSearchStore } from '../stores/search' // Import kho quản lý tìm kiếm (Pinia)
import axios from 'axios' // Thư viện để gọi API (lấy dữ liệu từ server)
import { useToast } from 'vue-toastification' // Thư viện hiển thị thông báo "pop-up" nhanh
import { computed } from 'vue'

import type { Products } from '@/types' // Import kiểu dữ liệu Product

/* --- KHỞI TẠO CÁC BIẾN VÀ KHO LƯU TRỮ --- */
const cart = useCartStore() // Kích hoạt kho giỏ hàng Pinia.
const products = ref<Products[]>([]) // Tạo mảng rỗng để chứa danh sách sản phẩm lấy từ API.
const backendInfo = ref(null) // Biến chứa thông tin từ server
const searchStore = useSearchStore() // Kết nối với kho chứa từ khóa tìm kiếm.
const toast = useToast() // Tạo biến 'toast' để gọi lệnh hiện thông báo

const selectedCategory = ref('Tất cả') // Mặc định hiển thị tất cả sản phẩm
const categories = ['Tất cả', 'Thức ăn', 'Đồ uống', 'Ăn vặt'] // Danh sách các nút sẽ hiển thị

/* --- CÁC HÀM XỬ LÝ LOGIC --- */

// Hàm gọi API để lấy danh sách sản phẩm
const fetchProducts = async () => {
  try {
    // Gửi yêu cầu GET đến server NestJS, kèm theo tham số tìm kiếm (search)
    const resProducts = await axios.get<Products[]>('http://localhost:3000/products', {
      params: { search: searchStore.searchQuery },
    })
    products.value = resProducts.data // Gán dữ liệu nhận được từ server vào biến products
  } catch (error) {
    console.error('Lỗi khi tải sản phẩm:', error) // Báo lỗi nếu server không phản hồi
  }
}

// Hàm xử lý khi người dùng nhấn nút "Thêm vào giỏ"
const handleAddToCart = (product) => {
  const result = cart.addToCart(product) // Gọi hàm thêm sản phẩm trong store giỏ hàng

  if (result.success) {
    toast.success(result.message, {
      // Hiện thông báo xanh thành công
      timeout: 3000, // Thông báo tự đóng sau 3 giây
    })
  } else {
    toast.error(result.message, {
      // Hiện thông báo đỏ khi có lỗi
      timeout: 3000,
    })
  }
}

// 'watch' sẽ canh chừng ô tìm kiếm, người dùng gõ đến đâu - gọi API lấy sản phẩm đến đó
watch(
  () => searchStore.searchQuery,
  () => {
    fetchProducts()
  },
)

// Khi trang vừa tải xong (Mounted), thực hiện các lệnh bên dưới
onMounted(async () => {
  try {
    // 1. Lấy thông tin chung từ server (ví dụ: "Chào mừng bạn quay lại")
    const resInfo = await axios.get('http://localhost:3000')
    backendInfo.value = resInfo.data

    // 2. Sau đó gọi hàm lấy danh sách sản phẩm để hiển thị lên màn hình
    fetchProducts()
  } catch (error) {
    console.error('Lỗi kết nối Backend:', error)
  }
})

const filteredProducts = computed(() => {
  if (selectedCategory.value === 'Tất cả') {
    return products.value // Trả về toàn bộ nếu chọn "Tất cả"
  }
  // Chỉ trả về những sản phẩm có category trùng với nút đang chọn
  return products.value.filter((p) => p.category === selectedCategory.value)
})
</script>

<template>
  <div class="home">
    <div
      v-if="backendInfo"
      class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-8 shadow-sm"
    >
      <p class="text-blue-800 font-medium">{{ backendInfo.message }}</p>
      <p class="text-blue-600 text-sm italic">
        Người Dùng: {{ backendInfo.user }} - {{ backendInfo.role }}
      </p>
    </div>

    <div class="flex gap-4 mb-6">
      <button
        v-for="cat in categories"
        :key="cat"
        @click="selectedCategory = cat"
        :class="selectedCategory === cat ? 'bg-green-600 text-white' : 'bg-gray-200'"
        class="cursor-pointer px-4 py-2 rounded-lg font-bold transition-all"
      >
        {{ cat }}
      </button>
    </div>

    <div class="flex flex-col lg:flex-row gap-8">
      <div class="flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <ProductCard
          v-for="p in filteredProducts"
          :key="p.id"
          :product="p"
          @add-to-cart="handleAddToCart"
        />
      </div>
    </div>
  </div>
</template>
