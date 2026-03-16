<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { ShoppingCart } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cart'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const cart = useCartStore()
const toast = useToast()
const router = useRouter()
const isValidating = ref(false)
const isShowQR = ref(false)
const userId = 1 // Giả sử userId là 1, bạn có thể thay đổi tùy theo logic đăng nhập của bạn
const infoKey = `customer_info_${userId}` // Key riêng cho từng user để tránh ghi đè thông tin

// Lấy thông tin thanh toán từ file .env
const bankId = import.meta.env.VITE_BANK_ID || ''
const accountNo = import.meta.env.VITE_BANK_ACCOUNT_NO || ''
const accountName = import.meta.env.VITE_BANK_ACCOUNT_NAME || ''
const qrTemplate = import.meta.env.VITE_VIETQR_TEMPLATE || ''

const generateQRUrl = () => {
  const amount = cart.totalPrice // lay tu pinia store
  const addInfo = encodeURIComponent(`Thanh toán đơn hàng ${Date.now()}`)

  return `https://img.vietqr.io/image/${bankId}-${accountNo}-${qrTemplate}.png?amount=${amount}&addInfo=${addInfo}&accountName=${encodeURIComponent(accountName)}`
}

const form = ref({
  fullname: '',
  phone: '',
  address: '',
})

const handleCheckout = () => {
  // Kiểm tra trống
  if (!form.value.fullname || !form.value.phone || !form.value.address) {
    toast.error('Vui lòng nhập đầy đủ thông tin nhận hàng')
    return
  }

  // Kiểm tra định dạng số điện thoại (ví dụ 10 số)
  const phoneRegex = /^\d{10}$/
  if (!phoneRegex.test(form.value.phone)) {
    toast.error('Số điện thoại không hợp lệ (phải có 10 chữ số)')
    return
  }

  isShowQR.value = true // Hiển thị QR code khi nhấn nút thanh toán
  toast.info('Vui lòng quét mã QR để thanh toán', {
    timeout: 3000,
  })
}

// Hàm này sẽ được gọi khi người dùng xác nhận đã chuyển khoản xong
const confirmPayment = async () => {
  try {
    // 1. Chuẩn bị dữ liệu đơn hàng theo đúng CreateOrderDto backend
    const orderData = {
      customer_name: form.value.fullname,
      customer_phone: form.value.phone,
      customer_address: form.value.address,
      total_price: cart.totalPrice,
      items: cart.items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    }

    // 2. Gọi API POST /orders
    await api.post('/orders', orderData)

    // 3. Thông báo và dọn dẹp
    toast.success('Đơn hàng của bạn đã được đặt thành công!', { timeout: 3000 })
    isShowQR.value = false
    await cart.clearCart() // Xóa giỏ hàng sau khi đặt hàng thành công

    // Xóa thông tin khách hàng đã lưu
    localStorage.removeItem(infoKey)

    // Quay về trang chủ sau 1 giây
    setTimeout(() => {
      router.push('/')
    }, 1000)
  } catch (error: unknown) {
    console.error('Lỗi khi đặt hàng:', error)
    const errorMessage =
      (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      'Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!'
    toast.error(errorMessage, { timeout: 5000 })
  }
}

//1. LocalStorage
watch(
  form,
  (newVal) => {
    localStorage.setItem('customer_info', JSON.stringify(newVal))
  },
  { deep: true }, // Quan trong: deep giup watch theo doi ca object, khong chi theo doi ca reference
)

onMounted(async () => {
  // Load thông tin khách hàng đã lưu từ localStorage
  const savedInfo = localStorage.getItem(infoKey)
  if (savedInfo) {
    try {
      form.value = JSON.parse(savedInfo)
    } catch (error) {
      console.error('Lỗi khi tải thông tin khách hàng:', error)
    }
  }

  // Bật trạng thái validating
  isValidating.value = true

  try {
    // Bước 1: Load giỏ hàng từ database
    await cart.fetchCart()

    // Bước 2: Kiểm tra giỏ hàng có rỗng không
    if (cart.items.length === 0) {
      toast.warning('Giỏ hàng của bạn đang trống', { timeout: 3000 })
      setTimeout(() => {
        router.push('/')
      }, 2000)
      return
    }

    // Bước 3: Validate từng sản phẩm trong giỏ hàng (kiểm tra tồn kho)
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
        router.push('')
      }, 3000)
    }
  } catch (error) {
    console.error('Lỗi khi validate giỏ hàng:', error)
    toast.error('Không thể kiểm tra giỏ hàng. Vui lòng thử lại!', { timeout: 3000 })
    setTimeout(() => {
      router.push('/')
    }, 2000)
  } finally {
    // QUAN TRỌNG: Tắt trạng thái validating trong mọi trường hợp
    // Đây là lý do chính trang không bị treo - finally luôn chạy!
    isValidating.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <!-- Loading State -->
    <div v-if="isValidating" class="max-w-4xl mx-auto text-center py-20">
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"
      ></div>
      <p class="mt-4 text-gray-600">Đang kiểm tra giỏ hàng...</p>
    </div>

    <!-- Checkout Form -->
    <div
      v-else
      class="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border-t-8 border-green-500"
    >
      <div class="p-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-8 flex items-center">
          <ShoppingCart :size="26" class="text-green-500 mr-2" />
          Thanh toán đơn hàng
        </h1>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div class="space-y-6">
            <h2 class="text-xl font-semibold text-green-700 border-b pb-2">Thông tin nhận hàng</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Họ và tên</label>
                <input
                  v-model="form.fullname"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  class="mt-1 block w-full border-green-200 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 border"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Số điện thoại</label>
                <input
                  v-model="form.phone"
                  type="text"
                  placeholder="0123456789"
                  class="mt-1 block w-full border-green-200 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 border"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Địa chỉ giao hàng</label>
                <textarea
                  v-model="form.address"
                  placeholder="123 Đường ABC, Phường XYZ, Quận 1, TP.Hà Nội"
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
                @click="handleCheckout"
                class="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-md mt-6"
              >
                ĐẶT HÀNG NGAY
              </button>
            </div>
          </div>
          <div
            v-if="isShowQR"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            @click.self="isShowQR = false"
          >
            <div
              class="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center animate-in fade-in zoom-in duration-300"
            >
              <h3 class="text-xl font-bold text-gray-900 mb-2">Thanh toán chuyển khoản</h3>
              <p class="text-sm text-gray-500 mb-6">
                Sử dụng ứng dụng Ngân hàng hoặc Ví điện tử để quét mã
              </p>

              <div
                class="relative inline-block p-4 bg-white border-4 border-pink-100 rounded-2xl mb-6 shadow-sm"
              >
                <img :src="generateQRUrl()" alt="Mã QR Thanh Toán" class="w-64 h-64 mx-auto" />
                <div
                  class="absolute inset-0 border-2 border-pink-400/20 rounded-2xl pointer-events-none"
                ></div>
              </div>

              <div
                class="bg-gray-50 rounded-2xl p-4 text-left space-y-2 border border-gray-100 mb-6"
              >
                <div class="flex justify-between">
                  <span class="text-gray-500 text-sm font-medium">Ngân hàng:</span>
                  <span class="text-gray-900 font-bold uppercase">{{ bankId }}</span>
                </div>
                <div class="flex justify-between border-t border-gray-200 pt-2 mt-2">
                  <span class="text-gray-500 text-sm font-medium">Số tài khoản:</span>
                  <span class="text-gray-900 font-bold">{{ accountNo }}</span>
                </div>
                <div class="flex justify-between border-t border-gray-200 pt-2 mt-2">
                  <span class="text-gray-500 text-sm font-medium">Chủ tài khoản:</span>
                  <span class="text-gray-900 font-bold uppercase">{{
                    accountName
                  }}</span>
                </div>
                <div class="flex justify-between border-t border-gray-200 pt-2 mt-2">
                  <span class="text-gray-500 text-sm font-medium">Số tiền:</span>
                  <span class="text-red-600 font-extrabold text-lg"
                    >{{ cart.totalPrice.toLocaleString() }}đ</span
                  >
                </div>
              </div>

              <button
                @click="confirmPayment"
                class="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all active:scale-95"
              >
                Xác nhận đã chuyển khoản
              </button>
              <p class="mt-4 text-xs text-gray-400 italic">Nhấn ra ngoài để đóng cửa sổ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
