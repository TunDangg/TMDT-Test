<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Plus, Ticket, Search, CheckCircle2, XCircle } from 'lucide-vue-next'
import { useToast } from 'vue-toastification'
import AdminSidebar from '@/components/AdminSidebar.vue'
import api from '@/services/api'

const toast = useToast()

// States
const vouchers = ref<any[]>([])
const isLoading = ref(false)
const searchQuery = ref('')

// Modal States
const isModalOpen = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)

// Form State
const form = ref({
  code: '',
  discount_type: 'percent',
  discount_value: 0,
  min_order_value: 0,
  max_discount_amount: null as number | null,
  expiry_date: '',
  usage_limit: 100,
  is_active: true,
})

// Fetch Data
const fetchVouchers = async () => {
  isLoading.value = true
  try {
    const res = await api.get('/vouchers')
    vouchers.value = res.data
  } catch (error) {
    console.error('Lỗi khi tải danh sách khuyến mãi:', error)
    toast.error('Không thể tải danh sách khuyến mãi')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchVouchers()
})

// Lọc Voucher theo thanh tìm kiếm
const filteredVouchers = computed(() => {
  return vouchers.value.filter((voucher) =>
    voucher.code.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

// Mở Modal Thêm mới
const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  // Reset form
  form.value = {
    code: '',
    discount_type: 'percent',
    discount_value: 0,
    min_order_value: 0,
    max_discount_amount: null,
    expiry_date: '',
    usage_limit: 100,
    is_active: true,
  }
  isModalOpen.value = true
}

// Mở Modal Sửa
const openEditModal = (voucher: any) => {
  isEditing.value = true
  editingId.value = voucher.id

  // Format ngày để đưa vào thẻ input type="datetime-local"
  const dateObj = new Date(voucher.expiry_date)
  dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset())
  const formattedDate = dateObj.toISOString().slice(0, 16)

  form.value = {
    code: voucher.code,
    discount_type: voucher.discount_type,
    discount_value: Number(voucher.discount_value),
    min_order_value: Number(voucher.min_order_value),
    max_discount_amount: voucher.max_discount_amount ? Number(voucher.max_discount_amount) : null,
    expiry_date: formattedDate,
    usage_limit: voucher.usage_limit,
    is_active: voucher.is_active,
  }
  isModalOpen.value = true
}

const closeVoucherModal = () => {
  isModalOpen.value = false
}

// Lưu Voucher (Thêm / Sửa)
const saveVoucher = async () => {
  if (!form.value.code || !form.value.expiry_date || form.value.discount_value <= 0) {
    toast.error('Vui lòng điền đầy đủ Mã, Giá trị giảm và Hạn sử dụng hợp lệ!')
    return
  }

  try {
    if (isEditing.value && editingId.value) {
      await api.put(`/vouchers/${editingId.value}`, form.value)
      toast.success('Cập nhật khuyến mãi thành công')
    } else {
      await api.post('/vouchers', form.value)
      toast.success('Thêm khuyến mãi mới thành công')
    }
    closeVoucherModal()
    fetchVouchers()
  } catch (error: any) {
    const msg = error.response?.data?.message || 'Có lỗi xảy ra, có thể mã này đã tồn tại!'
    toast.error(msg)
  }
}

// Xóa Voucher
const deleteVoucher = async (id: number) => {
  if (!confirm('Bạn có chắc chắn muốn xóa mã khuyến mãi này không? Hành động không thể hoàn tác.'))
    return

  try {
    await api.delete(`/vouchers/${id}`)
    toast.success('Xóa khuyến mãi thành công')
    fetchVouchers()
  } catch (error) {
    console.error('Lỗi khi xóa:', error)
    toast.error('Không thể xóa mã khuyến mãi này')
  }
}

// Đổi trạng thái Bật/Tắt nhanh
const toggleStatus = async (voucher: any) => {
  try {
    await api.put(`/vouchers/${voucher.id}`, { is_active: !voucher.is_active })
    toast.success(`Đã ${!voucher.is_active ? 'Bật' : 'Tắt'} mã ${voucher.code}`)
    fetchVouchers()
  } catch (error) {
    toast.error('Lỗi khi cập nhật trạng thái')
  }
}

// Format hiển thị
const formatCurrency = (value: any) => {
  if (!value) return '0đ'
  return Number(value).toLocaleString('vi-VN') + 'đ'
}

const formatDate = (dateString?: Date | string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
</script>

<template>
  <div class="flex w-full bg-slate-50 min-h-screen font-sans">
    <AdminSidebar />

    <main class="flex-1 w-full p-4 sm:p-6 overflow-visible">
      <header class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-slate-800">Quản lý Khuyến mãi (Vouchers)</h1>
          <p class="text-slate-500 mt-1">Quản lý các mã giảm giá và chương trình ưu đãi</p>
        </div>
      </header>

      <section
        class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-visible w-full"
      >
        <div
          class="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4"
        >
          <div class="flex items-center gap-2 flex-1 min-w-[300px] relative">
            <Search :size="18" class="text-slate-400 absolute ml-3 pointer-events-none" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm kiếm theo Mã CODE..."
              class="w-full pl-10 pr-4 h-11 border border-slate-200 rounded-xl focus:border-pink-500 outline-none text-sm transition-all uppercase placeholder:normal-case"
            />
            <button
              class="h-11 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-all"
            >
              Lọc
            </button>
          </div>
          <button
            @click="openAddModal"
            class="h-11 px-6 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-pink-100 flex items-center gap-2"
          >
            <span class="text-lg">+</span> Thêm Mã
          </button>
        </div>

        <div class="w-full overflow-visible">
          <table class="w-full text-left border-collapse min-w-full">
            <thead>
              <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th class="p-4 font-semibold">Mã CODE</th>
                <th class="p-4 font-semibold">Giá trị giảm</th>
                <th class="p-4 font-semibold">Đơn tối thiểu</th>
                <th class="p-4 font-semibold">Đã dùng</th>
                <th class="p-4 font-semibold">Hạn sử dụng</th>
                <th class="p-4 font-semibold text-center">Trạng thái</th>
                <th class="p-4 font-semibold text-center">Hành động</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <tr v-if="isLoading">
                <td colspan="7" class="p-8 text-center text-slate-500 italic">
                  Đang tải dữ liệu...
                </td>
              </tr>
              <tr v-else-if="filteredVouchers.length === 0">
                <td colspan="7" class="p-8 text-center text-slate-500 italic">
                  Không tìm thấy mã khuyến mãi nào.
                </td>
              </tr>
              <tr
                v-for="voucher in filteredVouchers"
                :key="voucher.id"
                class="hover:bg-slate-50 transition-colors relative hover:z-50"
              >
                <td class="p-4 font-mono font-bold text-pink-600 text-sm uppercase">
                  {{ voucher.code }}
                </td>
                <td class="p-4">
                  <span v-if="voucher.discount_type === 'percent'" class="font-bold">
                    Giảm {{ Number(voucher.discount_value) }}%
                  </span>
                  <span v-else class="font-bold">
                    Giảm {{ formatCurrency(voucher.discount_value) }}
                  </span>
                </td>
                <td class="p-4 text-sm text-slate-500">
                  {{ formatCurrency(voucher.min_order_value) }}
                </td>
                <td class="p-4">
                  <div class="flex items-center gap-2">
                    <div class="w-full bg-slate-200 rounded-full h-2 max-w-[80px]">
                      <div
                        class="bg-pink-500 h-2 rounded-full"
                        :style="{
                          width: `${Math.min((voucher.used_count / voucher.usage_limit) * 100, 100)}%`,
                        }"
                      ></div>
                    </div>
                    <span class="text-xs font-medium text-slate-600">
                      {{ voucher.used_count }}/{{ voucher.usage_limit }}
                    </span>
                  </div>
                </td>
                <td class="p-4 text-sm text-slate-500">
                  <span
                    :class="
                      new Date(voucher.expiry_date) < new Date() ? 'text-red-500 font-bold' : ''
                    "
                  >
                    {{ formatDate(voucher.expiry_date) }}
                  </span>
                </td>
                <td class="p-4 text-center">
                  <button
                    @click="toggleStatus(voucher)"
                    title="Nhấn để đổi trạng thái"
                    class="outline-none hover:scale-110 transition-transform"
                  >
                    <CheckCircle2 v-if="voucher.is_active" class="w-6 h-6 text-green-500 mx-auto" />
                    <XCircle v-else class="w-6 h-6 text-slate-300 mx-auto" />
                  </button>
                </td>
                <td class="p-4 text-center whitespace-nowrap">
                  <button
                    @click="openEditModal(voucher)"
                    class="text-blue-500 hover:text-blue-700 mr-3 text-sm font-bold"
                  >
                    Sửa
                  </button>
                  <button
                    @click="deleteVoucher(voucher.id)"
                    class="text-red-500 hover:text-red-700 text-sm font-bold"
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          class="p-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500"
        >
          <span>Danh sách các mã giảm giá</span>
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

      <div v-if="isModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div
          class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          @click="closeVoucherModal"
        ></div>

        <div
          class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl z-10 overflow-hidden animate-in fade-in zoom-in duration-300 border border-slate-100"
        >
          <div
            class="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50"
          >
            <h3 class="text-xl font-bold text-slate-800">
              {{ isEditing ? 'Sửa thông tin Khuyến mãi' : 'Tạo Khuyến mãi mới' }}
            </h3>
            <button @click="closeVoucherModal" class="text-slate-400 hover:text-slate-600 text-3xl">
              &times;
            </button>
          </div>

          <form @submit.prevent="saveVoucher" class="p-8 space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  class="block text-sm font-bold text-slate-700 mb-2 tracking-wide text-xs uppercase"
                >
                  Mã CODE <span class="text-pink-500">*</span>
                </label>
                <input
                  v-model="form.code"
                  type="text"
                  required
                  class="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 focus:border-pink-500 outline-none transition-all uppercase placeholder:normal-case placeholder:text-slate-300"
                  placeholder="VD: WELCOME50"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-bold text-slate-700 mb-2 tracking-wide text-xs uppercase"
                  >Trạng thái</label
                >
                <select
                  v-model="form.is_active"
                  class="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 focus:border-pink-500 outline-none transition-all cursor-pointer text-slate-700"
                >
                  <option :value="true">Hoạt động</option>
                  <option :value="false">Khóa (Vô hiệu hóa)</option>
                </select>
              </div>

              <div>
                <label
                  class="block text-sm font-bold text-slate-700 mb-2 tracking-wide text-xs uppercase"
                  >Loại giảm giá</label
                >
                <select
                  v-model="form.discount_type"
                  class="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 focus:border-pink-500 outline-none transition-all cursor-pointer text-slate-700"
                >
                  <option value="percent">Giảm theo %</option>
                  <option value="fixed">Giảm tiền mặt (VNĐ)</option>
                </select>
              </div>

              <div>
                <label
                  class="block text-sm font-bold text-slate-700 mb-2 tracking-wide text-xs uppercase"
                >
                  Giá trị giảm {{ form.discount_type === 'percent' ? '(%)' : '(VNĐ)' }}
                  <span class="text-pink-500">*</span>
                </label>
                <input
                  v-model="form.discount_value"
                  type="number"
                  min="0"
                  required
                  class="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 focus:border-pink-500 outline-none transition-all"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-bold text-slate-700 mb-2 tracking-wide text-xs uppercase"
                  >Đơn tối thiểu (VNĐ)</label
                >
                <input
                  v-model="form.min_order_value"
                  type="number"
                  min="0"
                  class="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 focus:border-pink-500 outline-none transition-all"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-bold text-slate-700 mb-2 tracking-wide text-xs uppercase"
                  :class="form.discount_type !== 'percent' ? 'text-slate-300' : ''"
                  >Giảm tối đa (Chỉ cho %)</label
                >
                <input
                  v-model="form.max_discount_amount"
                  type="number"
                  min="0"
                  :disabled="form.discount_type !== 'percent'"
                  placeholder="Không giới hạn"
                  class="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 focus:border-pink-500 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400 placeholder:text-slate-300"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-bold text-slate-700 mb-2 tracking-wide text-xs uppercase"
                  >Hạn sử dụng <span class="text-pink-500">*</span></label
                >
                <input
                  v-model="form.expiry_date"
                  type="datetime-local"
                  required
                  class="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 focus:border-pink-500 outline-none transition-all text-slate-700"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-bold text-slate-700 mb-2 tracking-wide text-xs uppercase"
                  >Số lượt tối đa</label
                >
                <input
                  v-model="form.usage_limit"
                  type="number"
                  min="1"
                  class="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 focus:border-pink-500 outline-none transition-all"
                />
              </div>
            </div>

            <div class="pt-4 flex space-x-4">
              <button
                type="button"
                @click="closeVoucherModal"
                class="flex-1 px-6 py-3 border-2 border-slate-100 rounded-2xl text-slate-500 font-bold hover:bg-slate-50 transition-all"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                class="flex-1 px-6 py-3 bg-pink-500 text-white rounded-2xl font-bold hover:bg-pink-600 transition-all shadow-lg shadow-pink-100"
              >
                {{ isEditing ? 'Lưu thay đổi' : 'Tạo mã giảm giá' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>
