<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { UserCircle, Package, Calendar, Mail, Shield } from 'lucide-vue-next'

const user = ref<any>(null)
const orders = ref<any[]>([])
const activeTab = ref('info') // 'info' hoặc 'orders'

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

const formatDate = (date: string) => new Date(date).toLocaleDateString('vi-VN')
</script>

<template>
  <div class="max-w-4xl mx-auto py-10">
    <div
      class="bg-white rounded-3xl p-8 shadow-sm border border-pink-100 flex items-center gap-6 mb-8"
    >
      <div
        class="w-24 h-24 bg-pink-500 rounded-full flex items-center justify-center text-white text-4xl font-bold"
      >
        {{ user?.username?.charAt(0).toUpperCase() }}
      </div>
      <div>
        <h1 class="text-3xl font-black text-slate-800">
          {{ user?.username }}</h1>
        <p class="text-slate-400 flex items-center gap-2 text-sm mt-1">
          <Shield :size="14" />
          {{ user?.role === 'admin' ? 'Quản trị viên' : 'Khách hàng thân thiết' }}
        </p>
      </div>
    </div>

    <div class="flex gap-4 mb-6 border-b border-slate-100 pb-4">
      <button
        @click="activeTab = 'info'"
        :class="
          activeTab === 'info'
            ? 'text-pink-600 border-b-2 border-pink-500 font-bold'
            : 'text-slate-400'
        "
        class="px-4 py-2 transition-all"
      >
        Thông tin chung
      </button>
      <button
        @click="activeTab = 'orders'"
        :class="
          activeTab === 'orders'
            ? 'text-pink-600 border-b-2 border-pink-500 font-bold'
            : 'text-slate-400'
        "
        class="px-4 py-2 transition-all"
      >
        Lịch sử đơn hàng
      </button>
    </div>

    <div
      v-if="activeTab === 'info'"
      class="bg-white rounded-3xl p-8 shadow-sm border border-slate-50 space-y-6 animate-in fade-in duration-500"
    >
      <div class="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
        <Mail class="text-pink-500" />
        <div>
          <p class="text-[10px] uppercase font-bold text-slate-400">Email liên hệ</p>
          <p class="font-bold text-slate-700">{{ user?.email }}</p>
        </div>
      </div>
      <div class="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
        <Calendar class="text-pink-500" />
        <div>
          <p class="text-[10px] uppercase font-bold text-slate-400">Ngày gia nhập</p>
          <p class="font-bold text-slate-700">{{ formatDate(user?.created_at) }}</p>
        </div>
      </div>
    </div>

    <div v-else class="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
      <div
        v-for="order in orders"
        :key="order.id"
        class="bg-white p-6 rounded-2xl border border-slate-100 flex justify-between items-center hover:shadow-md transition-all"
      >
        <div class="flex items-center gap-4">
          <div class="p-3 bg-pink-50 text-pink-500 rounded-xl"><Package /></div>
          <div>
            <p class="font-bold text-slate-800">Đơn hàng #ORD{{ order.id }}</p>
            <p class="text-xs text-slate-400">{{ formatDate(order.createdAt) }}</p>
          </div>
        </div>
        <div class="text-right">
          <p class="font-black text-pink-600">{{ Number(order.total_price).toLocaleString() }}đ</p>
          <span
            class="text-[10px] uppercase font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-500"
            >{{ order.status }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
