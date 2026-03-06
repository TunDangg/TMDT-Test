<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import AdminSidebar from '@/components/AdminSidebar.vue'

const stats = ref({
  totalProducts: 0,
  totalOrders: 0,
  totalRevenue: 0,
  pending: 0,
  processing: 0,
  shipped: 0,
  completed: 0,
  cancelled: 0,
})

// Màu sắc cho từng trạng thái đơn hàng
const getStatusIconClass = (key: string) => {
  const colors: Record<string, string> = {
    pending: 'text-amber-400',
    processing: 'text-blue-400',
    shipped: 'text-indigo-400',
    completed: 'text-green-500',
    cancelled: 'text-red-400',
  }
  return colors[key] || 'text-slate-300'
}

const isLoading = ref(true)

const fetchStats = async () => {
  isLoading.value = true
  try {
    // Gọi API để lấy số liệu thống kê (thay đổi URL theo API thực tế)
    const response = await api.get('/admin/stats')
    stats.value = response.data // Gán dữ liệu nhận được vào biến stats
  } catch (error) {
    console.error('Lỗi khi tải số liệu thống kê:', error) // Báo lỗi nếu server không phản hồi
  } finally {
    // Tạo độ trễ nhẹ để hiệu ứng loading mượt mà hơn
    setTimeout(() => {
      isLoading.value = false
    }, 500)
  }
}

// Hàm định dạng số thành định dạng tiền tệ Việt Nam
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

onMounted(() => {
  fetchStats()
})
</script>

<template>
  <div class="flex w-full bg-[#f8fafc] min-h-screen font-sans">
    <AdminSidebar />

    <main class="flex-1 w-full p-6 lg:p-10 overflow-x-hidden">
      <header class="flex justify-between items-center mb-10">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Bảng điều khiển</h1>
          <p class="text-slate-500 mt-1 text-sm font-medium">
            Chào mừng trở lại, hệ thống đang hoạt động tốt.
          </p>
        </div>
        <button
          @click="fetchStats"
          class="p-2 hover:rotate-180 transition-all duration-500 text-slate-400"
        >
          🔄
        </button>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div
          class="relative overflow-hidden bg-gradient-to-br from-pink-500 to-rose-600 p-8 rounded-[2rem] shadow-xl shadow-pink-200 text-white"
        >
          <div class="relative z-10">
            <p class="text-pink-100 text-sm font-bold uppercase tracking-widest">Tổng doanh thu</p>
            <h3 class="text-4xl font-black mt-3">{{ formatCurrency(stats.totalRevenue) }}</h3>
          </div>
          <div class="absolute -right-4 -bottom-4 text-white/10 text-9xl font-black italic">💰</div>
        </div>

        <div
          class="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between"
        >
          <div>
            <p class="text-slate-500 text-sm font-bold uppercase">Tổng đơn hàng</p>
            <h3 class="text-4xl font-black text-slate-800 mt-2">{{ stats.totalOrders }}</h3>
          </div>
        </div>

        <div
          class="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between"
        >
          <div>
            <div
              class="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center text-xl mb-4"
            >
              🍔
            </div>
            <p class="text-slate-500 text-sm font-bold uppercase">Sản phẩm hiện có</p>
            <h3 class="text-4xl font-black text-slate-800 mt-2">{{ stats.totalProducts }}</h3>
          </div>
          <button
              @click="$router.push('/admin/products')"
            class="text-slate-400 text-xs font-bold mt-4 hover:text-pink-500 transition-colors"
          >
            Quản lý sản phẩm →
          </button>
        </div>
      </div>

      <h2 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
        <span class="w-2 h-6 bg-pink-500 rounded-full"></span>
        Trạng thái vận hành
      </h2>

      <div class="grid grid-cols-2 lg:grid-cols-5 gap-5">
        <div
          v-for="(val, key) in {
            pending: 'Chờ xử lý',
            processing: 'Chuẩn bị',
            shipped: 'Đang giao',
            completed: 'Hoàn thành',
            cancelled: 'Đã hủy',
          }"
          :key="key"
          class="group bg-white p-5 rounded-2xl border border-slate-100 hover:border-pink-200 hover:shadow-lg hover:shadow-pink-50 transition-all cursor-default"
        >
          <p
            class="text-[10px] font-black uppercase tracking-tighter text-slate-400 group-hover:text-pink-400 transition-colors"
          >
            {{ val }}
          </p>
          <div class="flex items-end justify-between mt-2">
            <p class="text-3xl font-black text-slate-700">{{ stats[key] }}</p>
            <div :class="getStatusIconClass(key)" class="text-lg opacity-50">●</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
