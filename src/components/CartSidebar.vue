<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useToast } from 'vue-toastification'
import { ShoppingCart } from 'lucide-vue-next'

const cart = useCartStore()
const toast = useToast()

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const router = useRouter()
const goToCheckout = () => {
  // 1. Đóng sidebar lại trước (phát ra sự kiện 'close' để Component cha nhận được)
  emit('close')

  // 2. Sau đó mới chuyển trang
  router.push('/checkout')
}

const handleAddMore = async (item: any) => {
  const result = await cart.addToCart(item)
  if (!result.success) {
    toast.error(result.message, {
      timeout: 3000,
    })
  }
}
</script>

<template>
  <div v-if="isOpen" @click="$emit('close')" class="fixed inset-0 bg-black/50 z-60"></div>

  <div
    class="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-70 transition-transform duration-300 transform"
    :class="isOpen ? 'translate-x-0' : 'translate-x-full'"
  >
    <div class="p-6 h-full flex flex-col">
      <div class="flex justify-between items-center mb-6 border-b pb-4">
        <ShoppingCart :size="24" class="text-orange-500" />
        <h2 class="text-xl font-bold">Giỏ hàng ({{ cart.totalItems }})</h2>
        <button @click="$emit('close')" class="text-2xl hover:text-red-500 transition">✕</button>
      </div>

      <div class="flex-grow overflow-y-auto space-y-4">
        <!-- Empty state -->
        <div v-if="!cart.items || cart.items.length === 0" class="text-center py-12">
          <p class="text-gray-500 mb-4">Giỏ hàng trống</p>
          <button
            @click="$emit('close')"
            class="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
          >
            Tiếp tục mua sắm
          </button>
        </div>

        <!-- Cart items với safe guards -->
        <div
          v-else
          v-for="item in cart.items"
          :key="item.id"
          class="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100"
        >
          <div class="flex-grow">
            <p class="font-bold text-gray-800">{{ item.name || 'Sản phẩm' }}</p>
            <p class="text-xs text-orange-600 font-medium">{{ (item.price || 0).toLocaleString() }}đ</p>
            <button
              @click="cart.deleteItem(item.id)"
              class="text-[11px] text-gray-400 hover:text-red-500 uppercase mt-1 transition"
            >
              Huỷ
            </button>
          </div>

          <div class="flex items-center bg-white border rounded-lg px-2 py-1 gap-3 ml-2">
            <button
              @click="cart.removeFromCart(item.id)"
              class="text-gray-400 hover:text-red-600 font-bold w-4"
            >
              −
            </button>
            <span class="font-bold text-sm min-w-3.75 text-center">{{ item.quantity || 0 }}</span>
            <button
              @click="handleAddMore(item)"
              class="text-gray-400 hover:text-red-600 font-bold w-4"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div v-if="cart.items && cart.items.length > 0" class="border-t pt-6 mt-4">
        <div class="flex justify-between text-lg font-bold mb-4">
          <span class="text-gray-600">Tổng cộng:</span>
          <span class="text-red-600">{{ (cart.totalPrice || 0).toLocaleString() }}đ</span>
        </div>
        <button
          @click="goToCheckout"
          class="w-full bg-[#b32d34] text-white py-4 rounded-xl font-bold hover:bg-red-700 transition shadow-lg active:scale-95"
        >
          Thanh Toán Ngay
        </button>
      </div>
    </div>
  </div>
</template>
