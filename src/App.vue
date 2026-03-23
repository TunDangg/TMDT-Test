<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useCartStore } from './stores/cart'
import CartSidebar from './components/CartSidebar.vue'
import { useSearchStore } from './stores/search'
import { useToast } from 'vue-toastification'
import {
  ShieldCheck,
  UserCircle,
  ShoppingCart,
  ShoppingBasket,
  LogOut,
  User,
  Search,
  CircleX,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
} from 'lucide-vue-next'

const cartStore = useCartStore()
const searchStore = useSearchStore()
const cart = useCartStore()
const isCartOpen = ref<boolean>(false)
const username = ref<string | null>(null)
const router = useRouter()
const toast = useToast()
const userRole = ref<string | null>(null) // Biến lưu role của user để hiển thị menu admin
const isUserMenuOpen = ref(false)
const mainClass = computed(() => {
  const path = router.currentRoute.value.path
  if (path.startsWith('/admin')) return 'w-full'
  if (['/login', '/register'].includes(path)) return 'w-full p-0'
  return 'max-w-7xl mx-auto p-6'
})

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

  cartStore.clearLocalCart()

  toast.success('Đăng xuất thành công!', { timeout: 2000 })
  router.push('/login')
}
</script>

<template>
  <header
    v-if="!$route.path.startsWith('/admin') && !['/login', '/register'].includes($route.path)"
    class="bg-white shadow-md sticky top-0 z-50"
  >
    <nav class="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-2 shrink-0">
        <RouterLink to="/" class="cursor-pointer hover:opacity-80 transition-opacity">
          <h1 class="font-bold text-xl text-orange-600">EDTEXCO Fast Food Store</h1>
        </RouterLink>
      </div>

      <div class="grow max-w-xl relative">
        <Search
          :size="18"
          class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
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
          <ShoppingCart
            :size="18"
            class="text-orange-600 group-hover:text-orange-700 transition-colors"
          />
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

  <main :class="mainClass">
    <RouterView />
  </main>

  <footer
    v-if="!$route.path.startsWith('/admin') && !['/login', '/register'].includes($route.path)"
    class="bg-slate-900 text-slate-300 pt-16 pb-8"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div class="col-span-1">
          <router-link to="/" class="inline-block mb-6">
            <img
              src="https://edtexco.vn/_next/static/media/Logo.644aa387.png"
              alt="EDTEXCO Logo"
              class="h-10 w-auto object-contain brightness-0 invert"
            />
          </router-link>
          <p class="text-sm text-slate-400">
            EDTEXCO Fast Food Store - Nơi hội tụ những hương vị siêu cấp vip pro nhất quả đất!!!
          </p>
        </div>

        <div>
          <h3 class="text-white font-bold mb-6 uppercase tracking-wider text-sm">Khám phá</h3>
          <ul class="space-y-3 text-sm">
            <li>
              <a href="#" class="hover:text-pink-500 transition-colors">Thực đơn món chính</a>
            </li>
            <li><a href="#" class="hover:text-pink-500 transition-colors">Combo khuyến mãi</a></li>
            <li><a href="#" class="hover:text-pink-500 transition-colors">Cửa hàng gần nhất</a></li>
            <li><a href="#" class="hover:text-pink-500 transition-colors">Tin tức ẩm thực</a></li>
          </ul>
        </div>

        <div>
          <h3 class="text-white font-bold mb-6 uppercase tracking-wider text-sm">
            Hỗ trợ khách hàng
          </h3>
          <ul class="space-y-3 text-sm">
            <li>
              <a href="#" class="hover:text-pink-500 transition-colors">Chính sách vận chuyển</a>
            </li>
            <li>
              <a href="#" class="hover:text-pink-500 transition-colors">Điều khoản dịch vụ</a>
            </li>
            <li>
              <a href="#" class="hover:text-pink-500 transition-colors">Chính sách bảo mật</a>
            </li>
            <li>
              <a href="#" class="hover:text-pink-500 transition-colors">Câu hỏi thường gặp</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-white font-bold mb-6 uppercase tracking-wider text-sm">Liên Hệ</h3>
          <div class="flex gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all duration-300"
            >
              <Facebook :size="20" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all duration-300"
            >
              <Instagram :size="20" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all duration-300"
            >
              <Twitter :size="20" />
            </a>
          </div>
        </div>
      </div>

      <div
        class="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6"
      >
        <div class="text-xs text-slate-500">
          <p>© 2026 TMDT-Test. All rights reserved.</p>
        </div>

        <div class="flex flex-wrap justify-center gap-6 text-xs font-medium">
          <div class="flex items-center gap-2 group cursor-pointer">
            <Phone :size="14" class="text-pink-500 group-hover:scale-110 transition-transform" />
            <span class="group-hover:text-white transition-colors">0123 456 789</span>
          </div>
          <div class="flex items-center gap-2 group cursor-pointer">
            <Mail :size="14" class="text-pink-500 group-hover:scale-110 transition-transform" />
            <span class="group-hover:text-white transition-colors"
              >khongbietnua.12345678@gmail.com</span
            >
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
