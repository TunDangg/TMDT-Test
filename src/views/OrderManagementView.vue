<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import { Order } from '@/types'
import AdminSidebar from '@/components/AdminSidebar.vue'
import { ReceiptText, Printer, X, PackageSearch, Search, FileSpreadsheet } from 'lucide-vue-next'

const searchQuery = ref('')

// Dữ liệu mẫu Đơn hàng
const orders = ref(<Order[]>[])
const isLoading = ref(true)
const isOrderDetailModalOpen = ref(false)
const selectedOrder = ref<Order | null>(null)

// Ham lay danh sach don hang tu API
const fetchOrders = async () => {
  isLoading.value = true
  try {
    // Goi API lay danh sach don hang (thay doi URL theo API thuc te)
    const response = await api.get('/orders')
    orders.value = response.data // Gan du lieu nhan duoc vao bien orders
  } catch (error) {
    console.error('Lỗi khi tải đơn hàng:', error) // Bao loi neu server khong phan hoi
  } finally {
    isLoading.value = false // Du thanh cong hay loi, van tat trang thai loading
  }
}

onMounted(() => {
  fetchOrders()
})

// Ham cap nhat trang thai don hang ( admin )
const updateOrderStatus = async (orderId: number, newStatus: string) => {
  try {
    // Goi API cap nhat trang thai don hang (thay doi URL theo API thuc te)
    await api.patch(`/orders/${orderId}`, {
      status: newStatus,
    })
    // Cap nhat trang thai trong frontend sau khi cap nhat thanh cong
    const order = orders.value.find((o) => o.id === orderId)
    if (order) {
      order.status = newStatus as Order['status'] // Cap nhat trang thai trong frontend
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error)
  }
}

// Logic lọc đơn hàng
const filteredOrders = computed(() => {
  return orders.value.filter(
    (order) =>
      order.id.toString().includes(searchQuery.value.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

const formatDate = (dateString: string) => {
  if (!dateString) return '---'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

// Ham xu ly khi nhan nut "Xem chi tiet" (admin)
const showDetail = async (orderId: number) => {
  try {
    const response = await api.get(`/orders/${orderId}`)
    selectedOrder.value = response.data
    isOrderDetailModalOpen.value = true
  } catch (error) {
    console.error('Lỗi khi tải chi tiết đơn hàng:', error)
  }
}

// Màu sắc cho từng trạng thái đơn hàng
const getStatusClass = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-amber-100 text-amber-700'
    case 'processing':
      return 'bg-blue-100 text-blue-700'
    case 'shipped':
      return 'bg-green-100 text-green-700'
    case 'completed':
      return 'bg-green-100 text-green-700'
    case 'cancelled':
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
            class="h-11 px-6 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2"
          >
            Xuất Excel
          </button>
        </div>

        <div class="overflow-x-auto w-full">
          <table class="w-full text-left border-collapse min-w-full">
            <thead>
              <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th class="p-4 font-semibold">Mã đơn</th>
                <th class="p-4 font-semibold text-center">Thời gian đặt</th>
                <th class="p-4 font-semibold">Khách hàng</th>
                <th class="p-4 font-semibold">Địa Chỉ</th>
                <th class="p-4 font-semibold text-right">Tổng tiền</th>
                <th class="p-4 font-semibold text-center">Trạng thái</th>
                <th class="p-4 font-semibold text-center">Hành động</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <tr v-if="isLoading">
                <td colspan="6" class="p-8 text-center text-slate-500">
                  Đang tải dữ liệu đơn hàng...
                </td>
              </tr>

              <tr
                v-for="order in filteredOrders"
                :key="order.id"
                class="hover:bg-slate-50/80 transition-colors"
              >
                <td class="p-4 font-mono font-bold text-pink-600 text-sm">#ORD{{ order.id }}</td>

                <td class="p-4 text-center">
                  <div class="text-sm font-medium text-slate-700">
                    {{ formatDate(order.created_at).split(' ')[0] }}
                  </div>
                  <div class="text-[10px] text-slate-400">
                    {{ formatDate(order.created_at).split(' ')[1] }}
                  </div>
                </td>

                <td class="p-4 font-bold text-slate-800">
                  {{ order.customer_name }}
                  <div class="text-[10px] text-slate-500 font-normal">
                    {{ order.customer_phone }}
                  </div>
                </td>
                <td class="p-4 text-xs text-slate-500">{{ order.customer_address }}</td>
                <td class="p-4 text-right font-bold text-slate-900">
                  {{ Number(order.total_price).toLocaleString() }}đ
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
                  <div class="flex items-center justify-center gap-3">
                    <select
                      @change="updateOrderStatus(order.id, $event.target.value)"
                      class="text-xs border rounded-lg p-1.5 outline-none focus:border-pink-500 bg-white"
                      :value="order.status"
                    >
                      <option value="pending">Chờ xử lý</option>
                      <option value="processing">Đang chuẩn bị</option>
                      <option value="shipped">Đang giao</option>
                      <option value="completed">Đã hoàn thành</option>
                      <option value="cancelled">Hủy đơn</option>
                    </select>

                    <div class="flex gap-2 ml-2">
                      <button
                        @click="showDetail(order.id)"
                        class="text-blue-500 hover:underline text-xs font-bold"
                      >
                        Xem chi tiết
                      </button>
                      <button class="text-slate-400 hover:text-slate-600 text-xs font-bold">
                        In đơn
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          class="p-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500"
        >
          <span>Danh sách đơn hàng</span>
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

      <!-- Modal chi tiết đơn hàng (hiển thị khi isOrderDetailModalOpen = true) -->
      <div
        v-if="isOrderDetailModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col"
        >
          <div class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div class="flex items-center gap-2 text-slate-600">
              <ReceiptText :size="20" />
              <span class="font-bold uppercase text-xs tracking-widest">Xem trước hóa đơn</span>
            </div>
            <div class="flex items-center gap-2">
              <button
                class="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all"
              >
                <Printer :size="14" /> In hóa đơn
              </button>
              <button
                @click="isOrderDetailModalOpen = false"
                class="p-1.5 hover:bg-slate-200 rounded-full transition-all"
              >
                <X :size="18" />
              </button>
            </div>
          </div>

          <div class="p-10 overflow-y-auto bg-slate-100/30 flex-1">
            <div
              class="bg-white shadow-sm border border-slate-200 p-8 mx-auto w-full font-serif text-slate-800 relative"
            >
              <div class="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-6">
                <div>
                  <h2 class="text-2xl font-black text-pink-600 italic leading-none">
                    EDTEXCO <span class="text-slate-900 not-italic">STORE</span>
                  </h2>
                  <p class="text-[10px] mt-1 text-slate-500 font-sans uppercase tracking-tighter">
                    Hệ thống đồ ăn nhanh số 1 Việt Nam
                  </p>
                </div>
                <div class="text-right text-[11px] font-sans leading-relaxed">
                  <p class="font-bold">HÓA ĐƠN BÁN LẺ</p>
                  <p>Số: #ORD{{ selectedOrder?.id }}</p>
                  <p>Ngày: {{ formatDate(selectedOrder?.created_at) }}</p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4 mb-8 text-xs font-sans">
                <div>
                  <p class="text-[10px] uppercase font-bold text-slate-400 mb-1">Khách hàng:</p>
                  <p class="font-bold text-sm">{{ selectedOrder?.customer_name }}</p>
                  <p>{{ selectedOrder?.customer_phone }}</p>
                </div>
                <div class="text-right">
                  <p class="text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Địa chỉ giao hàng:
                  </p>
                  <p class="italic">{{ selectedOrder?.customer_address }}</p>
                </div>
              </div>

              <table class="w-full text-xs font-sans mb-8">
                <thead>
                  <tr class="border-b border-slate-200 text-left">
                    <th class="py-2 font-bold uppercase text-[10px]">Món ăn</th>
                    <th class="py-2 font-bold uppercase text-[10px] text-center">SL</th>
                    <th class="py-2 font-bold uppercase text-[10px] text-right">Đơn giá</th>
                    <th class="py-2 font-bold uppercase text-[10px] text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-for="item in selectedOrder?.items" :key="item.id">
                    <td class="py-3 font-medium">{{ item.product?.name }}</td>
                    <td class="py-3 text-center">{{ item.quantity }}</td>
                    <td class="py-3 text-right">{{ item.price.toLocaleString() }}đ</td>
                    <td class="py-3 text-right font-bold">
                      {{ (item.price * item.quantity).toLocaleString() }}đ
                    </td>
                  </tr>
                </tbody>
              </table>

              <div class="border-t-2 border-slate-900 pt-4 flex flex-col items-end gap-2 font-sans">
                <div class="flex justify-between w-48 text-xs">
                  <span>Tạm tính:</span>
                  <span>{{ Number(selectedOrder?.total_price).toLocaleString() }}đ</span>
                </div>
                <div class="flex justify-between w-48 text-xs">
                  <span>Phí vận chuyển:</span>
                  <span>0đ</span>
                </div>
                <div
                  class="flex justify-between w-48 text-sm font-black border-t border-slate-100 pt-2 mt-2"
                >
                  <span class="uppercase">Tổng cộng:</span>
                  <span class="text-pink-600"
                    >{{ Number(selectedOrder?.total_price).toLocaleString() }}đ</span
                  >
                </div>
              </div>

              <div class="mt-10 text-center font-sans">
                <p class="text-[10px] italic text-slate-400">
                  Cảm ơn quý khách đã tin tưởng và ủng hộ EDTEXCO Fast Food Store!
                </p>
                <div class="mt-4 flex justify-center gap-1 opacity-20">
                  <div v-for="i in 20" :key="i" class="w-1 h-1 bg-slate-900 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
