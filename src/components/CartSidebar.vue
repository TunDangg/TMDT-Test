<script setup>
import { useCartStore } from '../stores/cart'
const cart = useCartStore()
defineProps(['isOpen'])
defineEmits(['close'])
</script>

<template>
  <div v-if="isOpen" @click="$emit('close')" class="fixed inset-0 bg-black/50 z-[60]"></div>

  <div
    class="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-[70] transition-transform duration-300 transform"
    :class="isOpen ? 'translate-x-0' : 'translate-x-full'"
  >
    <div class="p-6 h-full flex flex-col">
      <div class="flex justify-between items-center mb-6 border-b pb-4">
        <h2 class="text-xl font-bold">Giỏ hàng ({{ cart.totalItems }})</h2>
        <button @click="$emit('close')" class="text-2xl hover:text-red-500 transition">✕</button>
      </div>

      <div class="flex-grow overflow-y-auto space-y-4">
        <div
          v-for="item in cart.items"
          :key="item.id"
          class="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100"
        >
          <div class="flex-grow">
            <p class="font-bold text-gray-800">{{ item.name }}</p>
            <p class="text-xs text-orange-600 font-medium">{{ item.price.toLocaleString() }}đ</p>
            <button
              @click="cart.deleteItem(item.id)"
              class="text-[11px] text-gray-400 hover:text-red-500 uppercase mt-1 transition"
            >
              Huỷ
            </button>
          </div>

          <div class="flex items-center bg-white border rounded-lg px-2 py-1 gap-3 ml-2">
            <button
              @click="cart.decreaseQuantity(item.id)"
              class="text-gray-400 hover:text-red-600 font-bold w-4"
            >
              −
            </button>
            <span class="font-bold text-sm min-w-[15px] text-center">{{ item.quantity }}</span>
            <button
              @click="cart.addToCart(item)"
              class="text-gray-400 hover:text-red-600 font-bold w-4"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div class="border-t pt-6 mt-4">
        <div class="flex justify-between text-lg font-bold mb-4">
          <span class="text-gray-600">Tổng cộng:</span>
          <span class="text-red-600">{{ cart.totalPrice.toLocaleString() }}đ</span>
        </div>
        <button
          class="w-full bg-[#b32d34] text-white py-4 rounded-xl font-bold hover:bg-red-700 transition shadow-lg active:scale-95"
        >
          Thanh Toán Ngay
        </button>
      </div>
    </div>
  </div>
</template>
