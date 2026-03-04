<script setup lang="ts">
import { ref, computed } from 'vue'
import AdminSidebar from '@/components/AdminSidebar.vue'

const searchQuery = ref('')

// Dữ liệu mẫu Đơn hàng
const orders = ref([
  {
    id: 'ORD001',
    customer: 'Trần Tuấn Đăng',
    total: 125000,
    status: 'Chờ xử lý',
    date: '2026-03-04 14:20',
  },
  {
    id: 'ORD002',
    customer: 'Nguyễn Văn A',
    total: 45000,
    status: 'Đang giao',
    date: '2026-03-04 15:10',
  },
  {
    id: 'ORD003',
    customer: 'Lê Thị B',
    total: 85000,
    status: 'Đã hoàn thành',
    date: '2026-03-03 10:30',
  },
  {
    id: 'ORD004',
    customer: 'Phạm Văn C',
    total: 210000,
    status: 'Đã hủy',
    date: '2026-03-03 09:15',
  },
])

// Logic lọc đơn hàng
const filteredOrders = computed(() => {
  return orders.value.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

// Màu sắc cho từng trạng thái đơn hàng
const getStatusClass = (status: string) => {
  switch (status) {
    case 'Chờ xử lý':
      return 'bg-amber-100 text-amber-700'
    case 'Đang giao':
      return 'bg-blue-100 text-blue-700'
    case 'Đã hoàn thành':
      return 'bg-green-100 text-green-700'
    case 'Đã hủy':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}
</script>

<template>
  <div class="flex w-full bg-slate-50 min-h-screen font-sans text-slate-900">
    <AdminSidebar />

    <main class="flex-1 w-full p-4 sm:p-6 overflow-x-hidden">
      <header class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Quản lý đơn hàng</h1>
          <p class="text-slate-500 mt-1">Theo dõi và cập nhật trạng thái đơn hàng từ khách hàng</p>
        </div>
      </header>

      <section
        class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden w-full"
      >
        <div
          class="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4"
        >
          <div class="flex items-center gap-2 flex-1 min-w-[300px]">
            <div class="relative flex-1">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Tìm mã đơn hoặc tên khách..."
                class="w-full pl-10 pr-4 h-11 border border-slate-200 rounded-xl focus:border-pink-500 outline-none text-sm transition-all"
              />
            </div>
            <button
              class="h-11 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-all"
            >
              Lọc
            </button>
          </div>
          <button
            class="h-11 px-6 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2"
          >
            📄 Xuất Excel
          </button>
        </div>

        <div class="overflow-x-auto w-full">
          <table class="w-full text-left border-collapse min-w-full">
            <thead>
              <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th class="p-4 font-semibold">Mã đơn</th>
                <th class="p-4 font-semibold">Khách hàng</th>
                <th class="p-4 font-semibold">Ngày đặt</th>
                <th class="p-4 font-semibold text-right">Tổng tiền</th>
                <th class="p-4 font-semibold text-center">Trạng thái</th>
                <th class="p-4 font-semibold text-center">Hành động</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <tr
                v-for="order in filteredOrders"
                :key="order.id"
                class="hover:bg-slate-50/80 transition-colors"
              >
                <td class="p-4 font-mono font-bold text-pink-600 text-sm">{{ order.id }}</td>
                <td class="p-4">
                  <div class="font-bold text-slate-800">{{ order.customer }}</div>
                </td>
                <td class="p-4 text-xs text-slate-500">{{ order.date }}</td>
                <td class="p-4 text-right font-bold text-slate-900">
                  {{ order.total.toLocaleString() }}đ
                </td>
                <td class="p-4 text-center">
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider',
                      getStatusClass(order.status),
                    ]"
                  >
                    {{ order.status }}
                  </span>
                </td>
                <td class="p-4 text-center whitespace-nowrap">
                  <button
                    class="text-blue-500 hover:text-blue-700 mr-3 text-sm font-bold underline"
                  >
                    Xem chi tiết
                  </button>
                  <button class="text-slate-400 hover:text-slate-600 text-sm font-bold">
                    In đơn
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          class="p-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500"
        >
          <span>Hiển thị 1 - 4 của 4 đơn hàng</span>
          <div class="flex gap-2">
            <button class="px-3 py-1 border rounded hover:bg-slate-50 disabled:opacity-50" disabled>
              Trước
            </button>
            <button class="px-3 py-1 border rounded bg-pink-500 text-white font-bold">1</button>
            <button class="px-3 py-1 border rounded hover:bg-slate-50 disabled:opacity-50" disabled>
              Sau
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
