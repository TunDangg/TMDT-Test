<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import type { Order } from '@/types' // Sử dụng interface đã định nghĩa
import { UserProfile } from '@/types'
import {
  UserCircle,
  Package,
  Calendar,
  Mail,
  Shield,
  Phone,
  CreditCard,
  MapPin,
  CheckCircle,
} from 'lucide-vue-next'

// Định nghĩa kiểu dữ liệu User để thay cho 'any'
const user = ref<UserProfile>({
  id: 0,
  username: '',
  full_name: '',
  email: '',
  phone: '',
  address: '',
  role: 'user', // Để 'user' thay vì 'customer' theo ý muốn của bạn ở Backend
  created_at: new Date().toISOString(),
})

const orders = ref<Order[]>([])
const activeTab = ref('info')
const isSaving = ref(false)

onMounted(async () => {
  try {
    const [userRes, ordersRes] = await Promise.all([
      api.get('/auth/profile'),
      api.get('/orders/my-orders'),
    ])
    user.value = userRes.data
    orders.value = ordersRes.data
  } catch (error) {
    console.error('Lỗi tải thông tin hồ sơ', error)
  }
})

const handleSave = async () => {
  isSaving.value = true
  try {
    const response = await api.put('/auth/update-profile', user.value)
    if (response.data) {
      user.value = response.data // Cập nhật lại dữ liệu từ server trả về
    }
    alert('Cập nhật thành công!')
  } catch (error) {
    console.error('Lỗi khi lưu', error)
    alert('Có lỗi xảy ra khi lưu thông tin.')
  } finally {
    isSaving.value = false
  }
}

const formatDate = (date: any) => new Date(date).toLocaleDateString('vi-VN')
const formatPrice = (price: number) => price.toLocaleString('vi-VN') + 'đ'
</script>

<template>
  <div class="min-h-screen bg-[#f8f9fb] p-4 md:p-8">
    <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-1 space-y-6">
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center">
          <div class="relative w-24 h-24 mx-auto mb-4">
            <div
              class="w-full h-full bg-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-black"
            >
              {{ user?.username?.charAt(0).toUpperCase() }}
            </div>
            <div
              class="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"
            ></div>
          </div>
          <h2 class="text-xl font-black text-slate-800">{{ user?.username }}</h2>
          <div class="flex justify-center gap-2 mt-3">
            <span
              class="px-3 py-1 text-[10px] font-bold uppercase bg-pink-100 text-pink-600 rounded-full"
            >
              {{ user?.role === 'admin' ? 'Quản trị viên' : 'Thành viên' }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <div class="bg-white p-4 rounded-2xl border border-slate-50 space-y-4">
            <div class="flex items-center gap-4">
              <div class="p-3 bg-blue-50 text-blue-500 rounded-xl"><CreditCard /></div>
              <div>
                <p class="text-[10px] uppercase font-bold text-slate-400">Số dư ví</p>
                <p class="font-bold text-slate-700">1.250.000đ</p>
              </div>
            </div>

            <hr class="border-slate-200" />

            <div class="flex items-center gap-4">
              <div class="p-3 bg-green-50 text-green-500 rounded-xl"><Shield :size="20" /></div>
              <div>
                <p class="text-[10px] uppercase font-bold text-slate-400">Tài khoản</p>
                <p class="text-sm font-bold text-slate-700">Đã xác minh</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div class="flex border-b border-slate-50">
            <button
              @click="activeTab = 'info'"
              :class="
                activeTab === 'info'
                  ? 'border-b-2 border-pink-500 text-pink-600 font-bold'
                  : 'text-slate-400'
              "
              class="flex-1 py-4 text-sm transition-all"
            >
              Thông tin cá nhân
            </button>
            <button
              @click="activeTab = 'orders'"
              :class="
                activeTab === 'orders'
                  ? 'border-b-2 border-pink-500 text-pink-600 font-bold'
                  : 'text-slate-400'
              "
              class="flex-1 py-4 text-sm transition-all"
            >
              Lịch sử đơn hàng
            </button>
          </div>

          <div v-if="activeTab === 'info'" class="p-8 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-xs font-bold uppercase text-slate-400 ml-1">
                  <UserCircle class="inline-block w-4 h-4 mr-1 text-slate-400" />
                  Tên đăng nhập
                </label>
                <input
                  v-model="user!.username"
                  type="text"
                  disabled
                  class="w-full bg-slate-100 border-none rounded-2xl px-4 py-3 text-slate-500 font-medium cursor-not-allowed"
                />
              </div>

              <div class="space-y-2">
                <label class="text-xs font-bold uppercase text-slate-400 ml-1">
                  <UserCircle class="inline-block w-4 h-4 mr-1 text-slate-400" />
                  Họ và tên
                </label>
                <input
                  v-model="user!.full_name"
                  type="text"
                  placeholder="Nhập họ và tên đầy đủ"
                  class="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-pink-500 font-medium"
                />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-bold uppercase text-slate-400 ml-1">
                  <Mail class="inline-block w-4 h-4 mr-1 text-slate-400" />
                  Email
                </label>
                <input
                  v-model="user!.email"
                  type="email"
                  placeholder="Chưa cập nhật"
                  class="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-pink-500 font-medium"
                />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-bold uppercase text-slate-400 ml-1">
                  <Phone class="inline-block w-4 h-4 mr-1 text-slate-400" />
                  Số điện thoại
                </label>
                <input
                  v-model="user.phone"
                  type="text"
                  placeholder="Chưa cập nhật"
                  class="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-pink-500 font-medium"
                />
              </div>
              <div class="space-y-2 md:col-span-2">
                <label class="text-xs font-bold uppercase text-slate-400 ml-1">
                  <MapPin class="inline-block w-4 h-4 mr-1 text-slate-400" />
                  Địa chỉ giao hàng mặc định
                </label>
                <input
                  v-model="user!.address"
                  type="text"
                  placeholder="Ví dụ: Số nhà, Đường, Phường/Xã..."
                  class="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-pink-500 font-medium"
                />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-bold uppercase text-slate-400 ml-1">
                  <Calendar class="inline-block w-4 h-4 mr-1 text-slate-400" />
                  Ngày tham gia
                </label>
                <div class="w-full bg-slate-100 rounded-2xl px-4 py-3 font-bold text-slate-500">
                  {{ user ? formatDate(user.created_at) : '' }}
                </div>
              </div>
            </div>
            <div class="flex justify-end pt-4">
              <button
                @click="handleSave"
                :disabled="isSaving"
                class="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-pink-600 transition-all active:scale-95 disabled:opacity-50"
              >
                {{ isSaving ? 'Đang lưu...' : 'Lưu thay đổi' }}
              </button>
            </div>
          </div>

          <div v-else class="p-8 space-y-8">
            <div v-for="(order, index) in orders" :key="order.id" class="flex gap-6 relative">
              <div class="flex flex-col items-center">
                <div
                  :class="order.status === 'completed' ? 'bg-green-500' : 'bg-orange-500'"
                  class="w-3 h-3 rounded-full z-10 ring-4 ring-slate-50"
                ></div>
                <div
                  v-if="index !== orders.length - 1"
                  class="w-0.5 h-full bg-slate-100 absolute top-3"
                ></div>
              </div>
              <div class="flex-grow pb-8">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-bold text-slate-800">Đơn hàng #ORD{{ order.id }}</h3>
                    <p class="text-xs text-slate-400 font-medium">
                      {{ formatDate(order.created_at) }}
                    </p>
                  </div>
                  <span
                    :class="
                      order.status === 'completed'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-orange-100 text-orange-600'
                    "
                    class="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full"
                  >
                    <CheckCircle v-if="order.status === 'completed'" :size="12" />{{ order.status }}
                  </span>
                </div>
                <div
                  class="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between"
                >
                  <div class="flex items-center gap-4">
                    <div class="p-2 bg-white rounded-xl shadow-sm">
                      <Package class="text-pink-500" />
                    </div>
                    <p class="text-sm font-bold text-slate-600">Tổng thanh toán</p>
                  </div>
                  <p class="font-black text-pink-600">{{ formatPrice(order.total_price) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
