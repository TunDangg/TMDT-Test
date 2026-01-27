<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useCartStore } from './stores/cart'
import CartSidebar from './components/CartSidebar.vue'
import { useSearchStore } from './stores/search'

const searchStore = useSearchStore()
const cart = useCartStore()
const isCartOpen = ref(false)
</script>

<template>
  <header class="bg-white shadow-md sticky top-0 z-50">
    <nav class="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-2 shrink-0">
        <h1 class="font-bold text-xl text-orange-600">Fast Food Store</h1>
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
        <RouterLink to="/" class="hover:font-bold hover:scale-110 transition-all"
          >Trang chủ</RouterLink
        >

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
