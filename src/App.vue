<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useCartStore } from './stores/cart'
import CartSidebar from './components/CartSidebar.vue'
import { useSearchStore } from './stores/search'
import { useToast } from 'vue-toastification'
import { ShieldCheck, UserCircle, ShoppingCart, ShoppingBasket, LogOut, User, Search, CircleX } from 'lucide-vue-next'

const searchStore = useSearchStore()
const cart = useCartStore()
const isCartOpen = ref<boolean>(false)
const username = ref<string | null>(null)
const router = useRouter()
const toast = useToast()
const userRole = ref<string | null>(null) // Biến lưu role của user để hiển thị menu admin
const isUserMenuOpen = ref(false)

onMounted(async () => {
  username.value = localStorage.getItem('username')
  // Lấy thêm role để phần quyền ẩn/ hiện admin
  userRole.value = localStorage.getItem('role')
  // Load giỏ hàng từ database ngay khi app khởi động
  await cart.fetchCart()
})

const closeUserMenu = () => {
  isUserMenuOpen.value = false
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  localStorage.removeItem('userId')
  localStorage.removeItem('role')
  username.value = null
  userRole.value = null
  cart.items = [] // Clear giỏ hàng local
  toast.success('Đăng xuất thành công!', { timeout: 2000 })
  router.push('/')
}
</script>

<template>
  <header v-if="!$route.path.startsWith('/admin')" class="bg-white shadow-md sticky top-0 z-50">
    <nav class="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-2 shrink-0">
        <RouterLink to="/" class="cursor-pointer hover:opacity-80 transition-opacity">
          <h1 class="font-bold text-xl text-orange-600">EDTEXCO Fast Food Store</h1>
        </RouterLink>
      </div>

      <div class="grow max-w-xl relative">
        <Search :size="18" class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          v-model="searchStore.searchQuery"
          type="text"
          placeholder="Tìm kiếm món ăn tại đây..."
          class="w-full pl-12 pr-12 py-2 border-2 border-orange-500 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
          @keydown.enter.prevent
        />

        <!-- Nút xóa search bên phải -->
        <button
          v-if="searchStore.searchQuery"
          @click="searchStore.searchQuery = ''"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition"
        >
          <CircleX :size="18" />
        </button>
      </div>

      <div class="flex items-center gap-6 font-medium text-gray-600">
        <div v-if="username" class="relative flex items-center gap-4">
          <div
            @click="isUserMenuOpen = !isUserMenuOpen"
            class="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full cursor-pointer hover:bg-green-100 transition-all border border-green-200"
          >
            <User :size="18" class="text-green-500" />

            <span class="text-green-700 font-bold">{{ username }}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 text-green-600 transition-transform"
              :class="{ 'rotate-180': isUserMenuOpen }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          <div
            v-if="isUserMenuOpen"
            class="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-[60] overflow-hidden animate-in fade-in zoom-in duration-200"
          >
            <RouterLink
              v-if="userRole === 'admin'"
              to="/admin"
              @click="closeUserMenu"
              class="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              <ShieldCheck :size="18" class="text-orange-500" />
              <span class="font-medium">Trang Quản Trị</span>
            </RouterLink>

            <RouterLink
              to="/profile"
              @click="closeUserMenu"
              class="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              <UserCircle :size="18" class="text-orange-500" />
              <span class="font-medium">Hồ Sơ Cá Nhân</span>
            </RouterLink>

            <RouterLink
              to="/checkout"
              @click="closeUserMenu"
              class="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              <ShoppingBasket :size="18" class="text-orange-500" />
              <span class="font-medium">Đơn hàng của tôi</span>
            </RouterLink>

            <div class="border-t border-gray-100 my-1"></div>

            <button
              @click="
                () => {
                  logout()
                  closeUserMenu()
                }
              "
              class="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors font-semibold text-left"
            >
              <LogOut :size="18" class="text-red-500" />
              <span>Đăng Xuất</span>
            </button>
          </div>
        </div>
        <RouterLink
          v-else
          to="/login"
          class="flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full hover:bg-orange-100 transition-all font-semibold"
        >
          Đăng Nhập
        </RouterLink>

        <div
          @click="isCartOpen = true"
          class="relative cursor-pointer group flex items-center gap-2 bg-orange-100 px-3 py-1.5 rounded-full hover:bg-orange-200 transition-colors"
        >
          <ShoppingCart :size="18" class="text-orange-600 group-hover:text-orange-700 transition-colors" />
          <span class="text-orange-700">Giỏ Hàng</span>
          <span
            class="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
          >
            {{ cart.totalItems }}
          </span>
        </div>
      </div>
    </nav>
  </header>

  <CartSidebar :isOpen="isCartOpen" @close="isCartOpen = false" />

  <main :class="$route.path.startsWith('/admin') ? 'w-full' : 'max-w-7xl mx-auto p-6'">
    <RouterView />
  </main>
</template>
