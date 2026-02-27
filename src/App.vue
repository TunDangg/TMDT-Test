<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useCartStore } from './stores/cart'
import CartSidebar from './components/CartSidebar.vue'
import { useSearchStore } from './stores/search'
import { useToast } from 'vue-toastification'

const searchStore = useSearchStore()
const cart = useCartStore()
const isCartOpen = ref<boolean>(false)
const username = ref<string | null>(null)
const router = useRouter()
const toast = useToast()

onMounted(() => {
  username.value = localStorage.getItem('username')
})

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  username.value = null
  toast.success('Đăng xuất thành công!', { timeout: 2000 })
  router.push('/')
}
</script>

<template>
  <header class="bg-white shadow-md sticky top-0 z-50">
    <nav class="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-2 shrink-0">
        <RouterLink to="/" class="cursor-pointer hover:opacity-80 transition-opacity">
          <h1 class="font-bold text-xl text-orange-600">EDTEXCO Fast Food Store</h1>
        </RouterLink>
      </div>

      <div class="flex-grow max-w-xl relative">
        <input
          v-model="searchStore.searchQuery"
          type="text"
          placeholder="Tìm kiếm món ăn tại đây..."
          class="w-full px-4 py-2 border-2 border-orange-500 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
          @keydown.enter.prevent
        />
      </div>

      <div class="flex items-center gap-6 font-medium text-gray-600">
        <div v-if="username" class="flex items-center gap-4">
          <div class="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full ">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
            <span class="text-green-700 font-semibold">{{ username }}</span>
          </div>
          <button
            @click="logout"
            class="flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1.5 rounded-full hover:bg-red-100 transition-all font-semibold "
          >
            Đăng Xuất
          </button>
        </div>
        <RouterLink
          v-else
          to="/login"
          class="flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full hover:bg-orange-100 transition-all font-semibold "
        >
          Đăng Nhập
        </RouterLink>

        <div
          @click="isCartOpen = true"
          class="relative cursor-pointer group flex items-center gap-2 bg-orange-100 px-3 py-1.5 rounded-full hover:bg-orange-200 transition-colors"
        >
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

  <main class="max-w-7xl mx-auto p-6">
    <RouterView />
  </main>
</template>
