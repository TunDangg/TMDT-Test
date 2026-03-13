<script setup lang="ts">
/* --- PHẦN IMPORT: Khai báo các công cụ sẽ sử dụng --- */
// ref: Tạo biến phản ứng (đổi giá trị là giao diện đổi theo).
// onMounted: Chạy code ngay sau khi trang web hiển thị xong.
// watch: Theo dõi một biến, nếu biến đó đổi thì chạy một hành động nào đó.
import { ref, onMounted, watch, computed } from 'vue' // Import các hàm cốt lõi của Vue 3
import api from '@/services/api' // Thư viện để gọi API (lấy dữ liệu từ server)
import ProductCard from '../components/ProductCard.vue' // Import component thẻ sản phẩm để hiển thị
import { useCartStore } from '@/stores/cart' // Import kho quản lý giỏ hàng (Pinia)
import { useSearchStore } from '@/stores/search' // Import kho quản lý tìm kiếm (Pinia)
import { useToast } from 'vue-toastification' // Thư viện hiển thị thông báo "pop-up" nhanh
import { Products } from '@/types' // Import kiểu dữ liệu Product
import { Zap, ArrowRight, TrendingUp, Frown } from 'lucide-vue-next'

/* --- ĐỊNH NGHĨA TYPES --- */
interface BackendInfo {
  message: string
  user: string
  role: string
}

/* --- KHỞI TẠO CÁC BIẾN VÀ KHO LƯU TRỮ --- */
const cart = useCartStore() // Kích hoạt kho giỏ hàng Pinia.
const products = ref<Products[]>([]) // Tạo mảng rỗng để chứa danh sách sản phẩm lấy từ API.
const backendInfo = ref<BackendInfo | null>(null) // Biến chứa thông tin từ server
const searchStore = useSearchStore() // Kết nối với kho chứa từ khóa tìm kiếm.
const toast = useToast() // Tạo biến 'toast' để gọi lệnh hiện thông báo

const selectedCategory = ref('Tất cả') // Mặc định hiển thị tất cả sản phẩm
const categories = ['Tất cả', 'Đồ ăn nhanh', 'Đồ uống', 'Ăn vặt'] // Danh sách các nút sẽ hiển thị
const isLoading = ref(true)

/* --- CÁC HÀM XỬ LÝ LOGIC --- */

// Hàm gọi API để lấy danh sách sản phẩm
const fetchProducts = async () => {
  isLoading.value = true
  try {
    // Lấy tất cả sản phẩm từ server (không filter ở backend nữa)
    // Frontend sẽ tự filter theo search query và category
    const resProducts = await api.get<Products[]>('/products')
    products.value = resProducts.data.filter(p => p.is_active !== false) // Gán dữ liệu nhận được từ server vào biến products
  } catch (error) {
    console.error('Lỗi khi tải sản phẩm:', error) // Báo lỗi nếu server không phản hồi
    toast.error('Không thể tải danh sách sản phẩm', { timeout: 3000 })
  } finally {
    isLoading.value = false // Dù thành công hay lỗi, vẫn tắt trạng thái loading
  }
}

// Hàm xử lý khi người dùng nhấn nút "Thêm vào giỏ"
const handleAddToCart = async (product: Products) => {
  const result = await cart.addToCart(product) // Gọi hàm thêm sản phẩm trong store giỏ hàng (await vì là async)

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

const scrollToProducts = () => {
  const productSection = document.getElementById('product-list')
  if (productSection) {
    productSection.scrollIntoView({ behavior: 'smooth' })
  }
}

// 'watch' theo dõi ô tìm kiếm - tự động reset category về "Tất cả" khi tìm kiếm
watch(
  () => searchStore.searchQuery,
  (newQuery) => {
    // Nếu người dùng bắt đầu gõ tìm kiếm, reset về "Tất cả" để hiện đầy đủ kết quả
    if (newQuery.trim() && selectedCategory.value !== 'Tất cả') {
      selectedCategory.value = 'Tất cả'
    }
  },
)

// Khi trang vừa tải xong (Mounted), thực hiện các lệnh bên dưới
onMounted(async () => {
  try {
    // 1. Lấy thông tin chung từ server (ví dụ: "Chào mừng bạn quay lại")
    const resInfo = await api.get('/')
    backendInfo.value = resInfo.data

    // 2. Sau đó gọi hàm lấy danh sách sản phẩm để hiển thị lên màn hình
    await fetchProducts()
  } catch (error) {
    console.error('Lỗi kết nối Backend:', error)
  }
})

// Lọc sản phẩm theo category được chọn
const filteredProducts = computed(() => {
  let filtered = products.value

  // Bước 1: Lọc theo category nếu không phải "Tất cả"
  if (selectedCategory.value !== 'Tất cả') {
    filtered = filtered.filter((p) => p.category === selectedCategory.value)
  }

  // Bước 2: Nếu có từ khóa tìm kiếm, lọc thêm ở frontend (để tăng trải nghiệm)
  // Backend đã trả về kết quả tìm kiếm rồi, nhưng lọc thêm theo category
  if (searchStore.searchQuery.trim()) {
    const query = searchStore.searchQuery.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query)),
    )
  }

  return filtered
})
</script>

<template>
  <section class="relative bg-white py-16 lg:py-24 overflow-hidden">
    <div
      class="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-pink-50 rounded-full blur-3xl opacity-50"
    ></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="flex flex-col lg:flex-row items-center justify-between gap-12">
        <div class="flex-1 text-center lg:text-left">
          <div
            class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 text-pink-600 mb-6"
          >
            <Zap :size="14" class="fill-current" />
            <span class="text-xs font-bold uppercase tracking-widest"
              >Giao hàng siêu tốc trong 15 phút</span
            >
          </div>

          <h1 class="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-6">
            Thưởng thức món ngon <br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600">
              Trọn vẹn hương vị
            </span>
          </h1>

          <p class="text-lg text-slate-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Khám phá thực đơn đa dạng từ Burger, Pizza đến những món tráng miệng ngọt ngào. Đồ ăn
            luôn nóng hổi và sẵn sàng phục vụ bạn mọi lúc.
          </p>

          <div class="flex flex-wrap justify-center lg:justify-start gap-4">
            <button
              @click="scrollToProducts"
              class="group px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl font-bold shadow-lg shadow-pink-200 transition-all flex items-center gap-2"
            >
              Đặt món ngay
              <ArrowRight :size="18" class="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              class="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all"
            >
              Xem khuyến mãi
            </button>
          </div>
        </div>

        <div class="flex-1 relative">
          <div class="relative w-full max-w-lg mx-auto">
            <img
              src="https://upload.urbox.vn/strapi/large_Jollibee_003_b6c3642178.jpg"
              alt="Delicious Burger"
              class="rounded-[3rem] shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 object-cover h-[450px] w-full border-8 border-white"
            />

            <div
              class="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-xl flex items-center gap-4 border border-pink-50"
            >
              <div
                class="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center"
              >
                <TrendingUp :size="24" />
              </div>
              <div>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                  Bán chạy nhất
                </p>
                <p class="text-sm font-bold text-slate-800">Gà Rán Jolibee</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
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

    <!-- Hiển thị thông tin tìm kiếm nếu đang search -->
    <div
      v-if="searchStore.searchQuery.trim()"
      class="mb-4 flex items-center gap-3 bg-orange-50 p-3 rounded-lg"
    >
      <span class="text-gray-700">
        Kết quả tìm kiếm cho:
        <strong class="text-orange-600">"{{ searchStore.searchQuery }}"</strong>
      </span>
      <button
        @click="searchStore.searchQuery = ''"
        class="ml-auto bg-orange-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-orange-600 transition"
      >
        ✕ Xóa tìm kiếm
      </button>
    </div>

    <div id="product-list" class="flex gap-4 mb-6">
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

    <!-- Loading state -->
    <div v-if="isLoading" class="text-center py-12">
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"
      ></div>
      <p class="mt-4 text-gray-600">Đang tải sản phẩm...</p>
    </div>

    <!-- Không tìm thấy sản phẩm -->
    <div v-else-if="filteredProducts.length === 0" class="text-center py-12 bg-gray-50 rounded-xl">
      <Frown :size="48" class="mx-auto text-gray-400 mb-4" />
      <p class="text-gray-600 text-lg font-medium">Không tìm thấy sản phẩm phù hợp</p>
      <p class="text-gray-400 text-sm mt-2">
        Thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác
      </p>
      <button
        v-if="searchStore.searchQuery.trim() || selectedCategory !== 'Tất cả'"
        @click="((searchStore.searchQuery = ''), (selectedCategory = 'Tất cả'))"
        class="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
      >
        Xem tất cả sản phẩm
      </button>
    </div>

    <!-- Danh sách sản phẩm -->
    <div v-else class="flex flex-col lg:flex-row gap-8">
      <div class="grow grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
