<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { ShoppingCart, Trash2, FileText, MapPin, Clock, ArrowRight, Ticket } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cart'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const cart = useCartStore()
const toast = useToast()
const router = useRouter()
const isValidating = ref(false)
const isShowQR = ref(false)
const userId = 1 // Giả sử userId là 1, bạn có thể thay đổi tùy theo logic đăng nhập
const infoKey = `customer_info_${userId}`

// Lấy thông tin thanh toán từ file .env
const bankId = import.meta.env.VITE_BANK_ID || ''
const accountNo = import.meta.env.VITE_BANK_ACCOUNT_NO || ''
const accountName = import.meta.env.VITE_BANK_ACCOUNT_NAME || ''
const qrTemplate = import.meta.env.VITE_VIETQR_TEMPLATE || ''

const generateQRUrl = () => {
  const amount = cart.totalPrice
  const addInfo = encodeURIComponent(`Thanh toán đơn hàng ${Date.now()}`)
  return `https://img.vietqr.io/image/${bankId}-${accountNo}-${qrTemplate}.png?amount=${amount}&addInfo=${addInfo}&accountName=${encodeURIComponent(accountName)}`
}

const form = ref({
  fullname: '',
  phone: '',
  address: '',
  note: '',
})

const handleCheckout = () => {
  if (!form.value.fullname || !form.value.phone || !form.value.address) {
    toast.error('Vui lòng nhập đầy đủ thông tin nhận hàng')
    return
  }

  const phoneRegex = /^\d{10}$/
  if (!phoneRegex.test(form.value.phone)) {
    toast.error('Số điện thoại không hợp lệ (phải có 10 chữ số)')
    return
  }

  isShowQR.value = true
  toast.info('Vui lòng quét mã QR để thanh toán', { timeout: 3000 })
}

const confirmPayment = async () => {
  try {
    const orderData = {
      customer_name: form.value.fullname,
      customer_phone: form.value.phone,
      customer_address: form.value.address,
      note: form.value.note,
      total_price: cart.totalPrice,
      items: cart.items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    }

    await api.post('/orders', orderData)

    toast.success('Đơn hàng của bạn đã được đặt thành công!', { timeout: 3000 })
    isShowQR.value = false
    await cart.clearCart()
    localStorage.removeItem(infoKey)

    setTimeout(() => {
      router.push('/')
    }, 1000)
  } catch (error: any) {
    console.error('Lỗi khi đặt hàng:', error)
    const errorMessage =
      error?.response?.data?.message || 'Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!'
    toast.error(errorMessage, { timeout: 5000 })
  }
}

watch(
  form,
  (newVal) => {
    localStorage.setItem(infoKey, JSON.stringify(newVal))
  },
  { deep: true },
)

onMounted(async () => {
  const savedInfo = localStorage.getItem(infoKey)
  if (savedInfo) {
    try {
      form.value = JSON.parse(savedInfo)
    } catch (error) {
      console.error('Lỗi khi tải thông tin khách hàng:', error)
    }
  }

  isValidating.value = true
  try {
    await cart.fetchCart()

    if (cart.items.length === 0) {
      toast.warning('Giỏ hàng của bạn đang trống', { timeout: 3000 })
      setTimeout(() => {
        router.push('/')
      }, 2000)
      return
    }

    const invalidItems = await cart.validateCartItems()
    if (invalidItems.length > 0) {
      invalidItems.forEach(({ product, reason }) => {
        toast.error(`${product.name}: ${reason}`, { timeout: 5000 })
      })
      setTimeout(() => {
        router.push('/')
      }, 3000)
    }
  } catch (error) {
    console.error('Lỗi khi validate giỏ hàng:', error)
    toast.error('Không thể kiểm tra giỏ hàng. Vui lòng thử lại!', { timeout: 3000 })
    setTimeout(() => {
      router.push('/')
    }, 2000)
  } finally {
    isValidating.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <div v-if="isValidating" class="max-w-4xl mx-auto text-center py-20 flex flex-col items-center">
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"
      ></div>
      <p class="text-slate-600 font-medium">Đang kiểm tra dữ liệu giỏ hàng...</p>
    </div>

    <div v-else class="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
      <div class="flex h-full grow flex-col">
        <div class="px-2 md:px-4 flex flex-1 py-8 w-full">
          <div class="flex flex-col w-full flex-1 gap-6">
            <header
              class="flex items-center justify-between whitespace-nowrap border-b border-slate-200 px-6 py-4 bg-white rounded-xl shadow-sm"
            >
              <div class="flex items-center gap-3 text-slate-900">
                <ShoppingCart class="text-pink-500 w-6 h-6" />
                <h2 class="text-xl font-bold">Giỏ hàng của bạn</h2>
              </div>
              <button
                @click="cart.clearCart()"
                class="flex items-center justify-center rounded-lg h-10 bg-slate-50 text-slate-700 gap-2 text-sm font-bold px-4 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <Trash2 class="w-4 h-4" />
                <span>Xóa tất cả</span>
              </button>
            </header>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div class="lg:col-span-2 flex flex-col gap-6">
                <section class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <h3 class="text-lg font-bold mb-4 text-slate-800 border-b pb-3">Món đã chọn</h3>

                  <div
                    v-for="item in cart.items"
                    :key="item.id"
                    class="flex items-center gap-4 bg-white py-4 border-b border-slate-50 last:border-0 justify-between"
                  >
                    <div class="flex items-center gap-4">
                      <div
                        class="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-16 bg-slate-100 border border-slate-200"
                        :style="`background-image: url(${item.image_url || 'https://placehold.co/150x150?text=Food'})`"
                      ></div>
                      <div class="flex flex-col justify-center">
                        <p
                          class="text-slate-900 text-base font-semibold leading-normal line-clamp-1"
                        >
                          {{ item.name }}
                        </p>
                        <p class="text-slate-500 text-sm font-medium leading-normal">
                          {{ item.price.toLocaleString() }}đ
                        </p>
                      </div>
                    </div>

                    <div class="shrink-0">
                      <div
                        class="flex items-center gap-3 text-slate-900 bg-slate-50 p-1 rounded-full border border-slate-200"
                      >
                        <button
                          @click="cart.removeFromCart(item.id)"
                          class="text-base font-bold flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm hover:bg-pink-500 hover:text-white transition-colors"
                        >
                          -
                        </button>
                        <span class="text-base font-bold w-6 text-center">{{ item.quantity }}</span>
                        <button
                          @click="cart.addToCart(item)"
                          class="text-base font-bold flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm hover:bg-pink-500 hover:text-white transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                <section class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <h3 class="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
                    <FileText class="text-pink-500 w-5 h-5" /> Ghi chú cho nhà bếp
                  </h3>
                  <textarea
                    v-model="form.note"
                    class="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm focus:ring-pink-500 focus:border-pink-500 placeholder-slate-400 outline-none transition-all"
                    placeholder="Ví dụ: Không hành, nhiều tương cà..."
                    rows="2"
                  ></textarea>
                </section>

                <section class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <div class="flex justify-between items-center mb-5">
                    <h3 class="text-lg font-bold flex items-center gap-2 text-slate-800">
                      <MapPin class="text-pink-500 w-5 h-5" /> Thông tin giao hàng
                    </h3>
                  </div>

                  <div class="space-y-4">
                    <input
                      v-model="form.fullname"
                      type="text"
                      placeholder="Họ và tên người nhận"
                      class="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
                    />
                    <input
                      v-model="form.phone"
                      type="text"
                      placeholder="Số điện thoại liên hệ"
                      class="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
                    />
                    <textarea
                      v-model="form.address"
                      placeholder="Địa chỉ giao hàng chi tiết (Số nhà, đường, phường/xã...)"
                      class="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
                      rows="3"
                    ></textarea>
                  </div>

                  <div
                    class="mt-5 flex items-center gap-3 bg-pink-50 p-3 rounded-lg border border-pink-100"
                  >
                    <Clock class="text-pink-600 w-5 h-5" />
                    <div>
                      <p class="text-xs text-pink-700 font-medium">Thời gian giao dự kiến</p>
                      <p class="text-sm font-bold text-pink-800">20 - 30 phút sau khi xác nhận</p>
                    </div>
                  </div>
                </section>
              </div>

              <div class="lg:col-span-1">
                <div class="sticky top-6 flex flex-col gap-6">
                  <section class="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                    <h3
                      class="text-xl font-bold mb-6 border-b border-slate-100 pb-3 text-slate-800"
                    >
                      Chi tiết đơn hàng
                    </h3>

                    <div class="space-y-4 mb-6">
                      <div class="flex justify-between text-slate-600">
                        <span>Tạm tính</span>
                        <span class="font-medium text-slate-900"
                          >{{ cart.totalPrice.toLocaleString() }}đ</span
                        >
                      </div>
                      <div class="flex justify-between text-slate-600">
                        <span>Phí vận chuyển</span>
                        <span class="font-medium text-slate-900">Theo bên vận chuyển</span>
                      </div>
                    </div>

                    <div
                      class="flex justify-between items-center pt-5 border-t border-dashed border-slate-200 mb-8"
                    >
                      <span class="text-lg font-bold text-slate-800">Tổng cộng</span>
                      <span class="text-2xl font-black text-pink-600"
                        >{{ cart.totalPrice.toLocaleString() }}đ</span
                      >
                    </div>

                    <button
                      @click="handleCheckout"
                      class="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-pink-500/30 flex items-center justify-center gap-2 text-lg"
                    >
                      Đặt đơn ngay
                      <ArrowRight class="w-5 h-5" />
                    </button>

                    <p class="text-center text-xs text-slate-400 mt-4">
                      Bằng cách nhấn Đặt đơn, bạn đồng ý với
                      <a class="underline hover:text-pink-500" href="#">Điều khoản</a> của chúng
                      tôi.
                    </p>
                  </section>

                  <div
                    class="bg-white p-4 rounded-xl border border-dashed border-slate-300 shadow-sm"
                  >
                    <div class="flex items-center gap-3">
                      <Ticket class="text-pink-500 w-5 h-5" />
                      <span class="text-sm font-semibold text-slate-700">Thêm mã giảm giá</span>
                      <button class="ml-auto text-pink-600 text-sm font-bold hover:text-pink-700">
                        Chọn mã
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="isShowQR"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      @click.self="isShowQR = false"
    >
      <div
        class="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center animate-in fade-in zoom-in duration-300"
      >
        <h3 class="text-xl font-bold text-slate-900 mb-2">Thanh toán chuyển khoản</h3>
        <p class="text-sm text-slate-500 mb-6">
          Sử dụng ứng dụng Ngân hàng hoặc Ví điện tử để quét mã
        </p>

        <div
          class="relative inline-block p-4 bg-white border-4 border-pink-100 rounded-2xl mb-6 shadow-sm"
        >
          <img :src="generateQRUrl()" alt="Mã QR Thanh Toán" class="w-64 h-64 mx-auto rounded-lg" />
          <div
            class="absolute inset-0 border-2 border-pink-400/20 rounded-2xl pointer-events-none"
          ></div>
        </div>

        <div class="bg-slate-50 rounded-2xl p-4 text-left space-y-2 border border-slate-100 mb-6">
          <div class="flex justify-between">
            <span class="text-slate-500 text-sm font-medium">Ngân hàng:</span>
            <span class="text-slate-900 font-bold uppercase">{{ bankId }}</span>
          </div>
          <div class="flex justify-between border-t border-slate-200 pt-2 mt-2">
            <span class="text-slate-500 text-sm font-medium">Số tài khoản:</span>
            <span class="text-slate-900 font-bold">{{ accountNo }}</span>
          </div>
          <div class="flex justify-between border-t border-slate-200 pt-2 mt-2">
            <span class="text-slate-500 text-sm font-medium">Chủ tài khoản:</span>
            <span class="text-slate-900 font-bold uppercase">{{ accountName }}</span>
          </div>
          <div class="flex justify-between border-t border-slate-200 pt-2 mt-2">
            <span class="text-slate-500 text-sm font-medium">Số tiền:</span>
            <span class="text-pink-600 font-extrabold text-lg"
              >{{ cart.totalPrice.toLocaleString() }}đ</span
            >
          </div>
        </div>

        <button
          @click="confirmPayment"
          class="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-md"
        >
          Xác nhận đã chuyển khoản
        </button>
        <p class="mt-4 text-xs text-slate-400 italic">Nhấn ra ngoài để đóng cửa sổ</p>
      </div>
    </div>
  </div>
</template>
