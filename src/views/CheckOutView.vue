<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'

const cart = useCartStore()
const toast = useToast()
const router = useRouter()
const isValidating = ref(false)

onMounted(async () => {
  isValidating.value = true

  // Validate cart items với backend
  const invalidItems = await cart.validateCartItems()

  if (invalidItems.length > 0) {
    // Hiển thị thông báo cho từng sản phẩm có vấn đề
    invalidItems.forEach(({ product, reason }) => {
      toast.error(`${product.name}: ${reason}`, {
        timeout: 5000,
      })
    })

    // Redirect về trang home sau 3 giây
    setTimeout(() => {
      router.push('/')
    }, 3000)
  }

  isValidating.value = false
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <!-- Loading State -->
    <div v-if="isValidating" class="max-w-4xl mx-auto text-center py-20">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      <p class="mt-4 text-gray-600">Đang kiểm tra giỏ hàng...</p>
    </div>

    <!-- Checkout Form -->
    <div
      v-else
      class="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border-t-8 border-green-500"
    >
      <div class="p-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-8 flex items-center">
          <span class="mr-3 text-green-600">🛒</span> Xác nhận thanh toán
        </h1>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div class="space-y-6">
            <h2 class="text-xl font-semibold text-green-700 border-b pb-2">Thông tin nhận hàng</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Họ và tên</label>
                <input
                  type="text"
                  class="mt-1 block w-full border-green-200 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 border"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Số điện thoại</label>
                <input
                  type="text"
                  class="mt-1 block w-full border-green-200 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 border"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Địa chỉ giao hàng</label>
                <textarea
                  class="mt-1 block w-full border-green-200 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 border"
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>

          <div class="bg-green-50 p-6 rounded-xl border border-green-100">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Đơn hàng của bạn</h2>
            <div class="space-y-4">
              <div v-for="item in cart.items" :key="item.id" class="flex justify-between">
                <span>{{ item.name }} (x{{ item.quantity }})</span>
                <span class="font-medium text-green-700"
                  >{{ (item.price * item.quantity).toLocaleString() }}đ</span
                >
              </div>
              <div
                class="border-t border-green-200 pt-4 mt-4 flex justify-between font-bold text-lg"
              >
                <span>Tổng cộng:</span>
                <span class="text-red-600">{{ cart.totalPrice.toLocaleString() }}đ</span>
              </div>
              <button
                class="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-md mt-6"
              >
                ĐẶT HÀNG NGAY
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
