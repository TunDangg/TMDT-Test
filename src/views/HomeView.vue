<script setup>
import { ref, onMounted, watch } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { useCartStore } from '../stores/cart'
import { useSearchStore } from '../stores/search'
import axios from 'axios'
import { useToast } from 'vue-toastification'

const cart = useCartStore()
const products = ref([])
const backendInfo = ref(null)
const searchStore = useSearchStore()
const toast = useToast()

// Hàm lấy danh sách sản phẩm (có hỗ trợ tìm kiếm)
const fetchProducts = async () => {
  try {
    const resProducts = await axios.get('http://localhost:3000/products', {
      params: { search: searchStore.searchQuery }, // Gửi query param 'search' lên NestJS
    })
    products.value = resProducts.data
  } catch (error) {
    console.error('Lỗi khi tải sản phẩm:', error)
  }
}

// Hàm mới để vừa thêm vào giỏ, vừa hiện thông báo
const handleAddToCart = (product) => {
  cart.addToCart(product)
  toast.success(`Đã thêm ${product.name} vào giỏ hàng!`, {
    timeout: 3000,
  })
}

// Theo dõi searchQuery, khi người dùng nhập chữ sẽ tự động gọi lại API
watch(
  () => searchStore.searchQuery,
  () => {
    fetchProducts()
  },
)

onMounted(async () => {
  try {
    const resInfo = await axios.get('http://localhost:3000')
    backendInfo.value = resInfo.data
    fetchProducts() // Hàm lấy sản phẩm lần đầu
  } catch (error) {
    console.error('Lỗi kết nối Backend:', error)
  }
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
        Lập trình viên: {{ backendInfo.user }} - {{ backendInfo.role }}
      </p>
    </div>

    <div class="flex flex-col lg:flex-row gap-8">
      <div class="flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <ProductCard
          v-for="p in products"
          :key="p.id"
          :product="p"
          @add-to-cart="handleAddToCart"
        />
      </div>
    </div>
  </div>
</template>
