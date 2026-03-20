<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AdminSidebar from '@/components/AdminSidebar.vue'
import { useToast } from 'vue-toastification'
import api from '@/services/api'
import { Lead } from '@/types'
import { Search } from 'lucide-vue-next'

const searchQuery = ref('')
const selectedStatus = ref('') // Biến để lưu trạng thái lọc
const toast = useToast()

// Dữ liệu mẫu khách hàng tiềm năng
const leads = ref<Lead[]>([])

const fetchLeads = async () => {
  try {
    const response = await api.get('/leads')
    leads.value = response.data
  } catch (error) {
    console.error('Lỗi khi tải danh sách khách hàng tiềm năng:', error)
  }
}

onMounted(() => {
  fetchLeads()
})

const filteredLeads = computed(() => {
  return leads.value.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      lead.phone.includes(searchQuery.value)

    const matchesStatus = selectedStatus.value === '' || lead.status === selectedStatus.value

    return matchesSearch && matchesStatus
  })
})

const newLead = ref({
  name: '',
  phone: '',
  email: '',
  source: 'Website',
  status: 'NEW',
  notes: '',
})

const currentLead = ref<Lead>({
  name: '',
  phone: '',
  email: '',
  source: 'Website',
  status: 'NEW',
  notes: '',
})

const isModalOpen = ref(false)
const isDetailModal = ref(false) // Biến để phân biệt modal đang mở là thêm mới hay xem chi tiết

const openLeadModal = () => {
  isModalOpen.value = true
  // Reset lai form them moi khi dong modal
  newLead.value = {
    name: '',
    phone: '',
    email: '',
    source: 'Website',
    status: 'NEW',
    notes: '',
  }
}

const closeLeadModal = () => {
  isModalOpen.value = false
  // Reset lại form thêm mới khi đóng modal
  newLead.value = {
    name: '',
    phone: '',
    email: '',
    source: 'Website',
    status: 'NEW',
    notes: '',
  }
}

const openDetailLeadModal = (lead: Lead) => {
  // Dung spread operator de clone du lieu
  currentLead.value = { ...lead }
  isDetailModal.value = true
}

const closeDetailLeadModal = () => {
  isDetailModal.value = false
}

const updateLead = async () => {
  try {
    await api.patch(`/leads/${currentLead.value.id}`, currentLead.value)

    closeDetailLeadModal()
    await fetchLeads()
    toast.success('Cập nhật trạng thái khách hàng thành công!')
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái khách hàng:', error)
    toast.error('Có lỗi xảy ra khi cập nhật trạng thái khách hàng. Vui lòng thử lại.')
  }
}

const deleteLead = async (id?: number) => {
  if (!id) return
  // Hiển thị hộp thoại xác nhận trước khi xoá
  if (
    confirm('Bạn có chắc chắn muốn xoá khách hàng này không? Hành động này không thể hoàn tác.')
  ) {
    try {
      await api.delete(`/leads/${id}`) // Gọi API DELETE
      await fetchLeads() // Tải lại bảng
      toast.success('Đã xoá khách hàng thành công!')
    } catch (error) {
      console.error('Lỗi khi xoá:', error)
      toast.error('Xoá thất bại, vui lòng thử lại!')
    }
  }
}

const submitLead = async () => {
  try {
    // Goi API luu vao DB
    await api.post('/leads', newLead.value)

    // Đóng modal
    closeLeadModal()

    // Tải lại danh sách mới nhất từ Backend
    await fetchLeads()

    // Hiển thị thông báo thành công
    toast.success('Thêm khách hàng tiềm năng thành công!')
  } catch (error) {
    console.error('Lỗi khi thêm khách hàng tiềm năng:', error)
    toast.error('Có lỗi xảy ra khi thêm khách hàng tiềm năng. Vui lòng thử lại.')
  }
}

// Hàm xử lý đổi trạng thái nhanh ngay ngoài bảng
const updateLeadStatusQuickly = async (lead: Lead, newStatus: string) => {
  try {
    // Backend dùng updateData: any nên gửi mỗi status vẫn được
    await api.patch(`/leads/${lead.id}`, { status: newStatus })
    toast.success('Đã cập nhật trạng thái nhanh!')
    await fetchLeads() // Tải lại bảng để đồng bộ dữ liệu
  } catch (error) {
    console.error('Lỗi khi cập nhật nhanh trạng thái:', error)
    toast.error('Có lỗi xảy ra khi cập nhật trạng thái.')
  }
}

// Hàm này để tránh lỗi đỏ typescript
const onStatusChange = (event: Event, lead: Lead) => {
  const target = event.target as HTMLSelectElement
  if (target && target.value) {
    updateLeadStatusQuickly(lead, target.value)
  }
}

// Cập nhật lại màu sắc theo key tiếng Anh
const getStatusColor = (status?: string) => {
  switch (status) {
    case 'NEW':
      return 'bg-blue-100 text-blue-700'
    case 'CONTACTING':
      return 'bg-purple-100 text-purple-700'
    case 'CONTACTED':
      return 'bg-indigo-100 text-indigo-700'
    case 'CONVERTED':
      return 'bg-green-100 text-green-700'
    case 'LOST':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
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
  }).format(date) // Hiển thị ngày giờ theo định dạng Việt Nam
}
</script>

<template>
  <div class="flex w-full bg-slate-50 min-h-screen font-sans">
    <AdminSidebar />

    <main class="flex-1 w-full p-4 sm:p-6 overflow-visible">
      <header class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-slate-800">Khách hàng tiềm năng (Leads)</h1>
          <p class="text-slate-500 mt-1">Quản lý và theo dõi khách hàng</p>
        </div>
      </header>

      <section
        class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-visible w-full"
      >
        <div
          class="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4"
        >
          <div class="flex items-center gap-2 flex-1 min-w-[300px]">
            <Search :size="18" class="text-slate-400 absolute ml-3 pointer-events-none" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm kiếm theo tên, số điện thoại khách hàng"
              class="w-full pl-10 pr-4 h-11 border border-slate-200 rounded-xl focus:border-pink-500 outline-none text-sm transition-all"
            />
            <select
              v-model="selectedStatus"
              class="h-11 border border-slate-200 rounded-xl px-4 focus:border-pink-500 outline-none text-sm transition-all cursor-pointer"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="NEW">Mới</option>
              <option value="CONTACTING">Đang tư vấn</option>
              <option value="CONTACTED">Đã tư vấn</option>
              <option value="OPPORTUNITY">Cơ hội</option>
              <option value="CONVERTED">Đã chốt</option>
              <option value="LOST">Thất bại</option>
            </select>
            <button
              class="h-11 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-all"
            >
              Lọc
            </button>
          </div>
          <button
            @click="openLeadModal"
            class="h-11 px-6 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-pink-100 flex items-center gap-2"
          >
            <span class="text-lg">+</span> Thêm Lead
          </button>
        </div>

        <div class="w-full overflow-visible">
          <table class="w-full text-left border-collapse min-w-full">
            <thead>
              <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th class="p-4 font-semibold">ID</th>
                <th class="p-4 font-semibold">Họ & Tên</th>
                <th class="p-4 font-semibold">Số điện thoại</th>
                <th class="p-4 font-semibold">Email</th>
                <th class="p-4 font-semibold">Nguồn</th>
                <th class="p-4 font-semibold text-center">Ghi chú</th>
                <th class="p-4 font-semibold text-center">Trạng thái</th>
                <th class="p-4 font-semibold text-center">Hành động</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <tr
                v-for="lead in filteredLeads"
                :key="lead.id"
                class="hover:bg-slate-50 transition-colors relative hover:z-50"
              >
                <td class="p-4 font-mono font-bold text-pink-600 text-sm">#{{ lead.id }}</td>
                <td class="p-4">
                  <p class="font-bold">{{ lead.name }}</p>
                  <p class="text-xs text-slate-400 mt-0.5">{{ formatDate(lead.created_at) }}</p>
                </td>
                <td class="p-4 text-sm">{{ lead.phone }}</td>
                <td class="p-4 text-sm text-slate-500">{{ lead.email || 'N/A' }}</td>
                <td class="p-4 text-sm text-slate-500">{{ lead.source }}</td>

                <td class="p-4 text-sm text-slate-500 max-w-[250px] align-center relative">
                  <div v-if="lead.notes" class="group/tooltip inline-block w-full cursor-help">
                    <div
                      class="bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 text-xs truncate w-full"
                    >
                      {{ lead.notes }}
                    </div>

                    <div
                      class="invisible opacity-0 group-hover/tooltip:visible group-hover/tooltip:opacity-100 transition-all duration-200 absolute z-[99999] w-72 p-4 bg-white text-slate-700 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border border-slate-100 bottom-[calc(100%-10px)] left-0 pointer-events-none"
                    >
                      <div
                        class="font-bold mb-2 border-b border-slate-100 pb-2 text-pink-500 uppercase tracking-wider text-[10px] text-center"
                      >
                        Nhật ký tư vấn
                      </div>

                      <div
                        class="leading-relaxed whitespace-pre-wrap break-words text-[13px] text-slate-600"
                      >
                        {{ lead.notes }}
                      </div>

                      <div
                        class="absolute top-full left-10 border-[8px] border-transparent border-t-white"
                      ></div>
                    </div>
                  </div>
                  <span v-else class="text-slate-300 italic text-xs">Trống</span>
                </td>

                <td class="p-4 text-center align-center">
                  <select
                    :value="lead.status"
                    @change="onStatusChange($event, lead)"
                    :class="[
                      'px-2 py-1.5 min-w-[110px] rounded-full text-[11px] font-bold uppercase tracking-wider outline-none border-none cursor-pointer focus:ring-2 focus:ring-pink-200 transition-all text-center [text-align-last:center] mt-1',
                      getStatusColor(lead.status),
                    ]"
                  >
                    <option value="NEW" class="bg-white text-slate-700">Mới</option>
                    <option value="CONTACTING" class="bg-white text-slate-700">Đang tư vấn</option>
                    <option value="CONTACTED" class="bg-white text-slate-700">Đã tư vấn</option>
                    <option value="OPPORTUNITY" class="bg-white text-slate-700">Cơ hội</option>
                    <option value="CONVERTED" class="bg-white text-slate-700">Đã chốt</option>
                    <option value="LOST" class="bg-white text-slate-700 text-center">
                      Thất bại
                    </option>
                  </select>
                </td>
                <td class="p-4 text-center whitespace-nowrap">
                  <button
                    @click="openDetailLeadModal(lead)"
                    class="text-blue-500 hover:text-blue-700 mr-3 text-sm font-bold"
                  >
                    Chi tiết
                  </button>

                  <button
                    @click="deleteLead(lead.id)"
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
          <span>Danh sách khách hàng tiềm năng</span>
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

      <!-- Modal thêm lead mới -->
      <div v-if="isModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div
          class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          @click="closeLeadModal"
        ></div>

        <div
          class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl z-10 overflow-hidden animate-in fade-in zoom-in duration-300 border border-slate-100"
        >
          <div
            class="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50"
          >
            <h3 class="text-xl font-bold text-slate-800">Thêm khách hàng mới</h3>
            <button @click="closeLeadModal" class="text-slate-400 hover:text-slate-600 text-3xl">
              &times;
            </button>
          </div>

          <form @submit.prevent="submitLead" class="p-8 space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="md:col-span-2">
                <label
                  class="block text-sm font-bold text-slate-700 mb-2 tracking-wide text-xs uppercase"
                  >Họ và Tên</label
                >
                <input
                  v-model="newLead.name"
                  type="text"
                  required
                  class="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 focus:border-pink-500 focus:ring-0 outline-none transition-all placeholder:text-slate-300"
                  placeholder="VD: Nguyễn Văn A"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-bold text-slate-700 mb-2 tracking-wide text-xs uppercase"
                  >Số điện thoại</label
                >
                <input
                  v-model="newLead.phone"
                  type="text"
                  required
                  class="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 focus:border-pink-500 outline-none transition-all placeholder:text-slate-300"
                  placeholder="0987654321"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-bold text-slate-700 mb-2 tracking-wide text-xs uppercase"
                  >Email</label
                >
                <input
                  v-model="newLead.email"
                  type="email"
                  class="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 focus:border-pink-500 outline-none transition-all placeholder:text-slate-300"
                  placeholder="VD: example@email.com"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-bold text-slate-700 mb-2 tracking-wide text-xs uppercase"
                  >Nguồn</label
                >
                <select
                  v-model="newLead.source"
                  class="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 focus:border-pink-500 outline-none transition-all cursor-pointer text-slate-700"
                >
                  <option value="Facebook">Facebook</option>
                  <option value="Website">Website</option>
                  <option value="Zalo">Zalo</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div>
                <label
                  class="block text-sm font-bold text-slate-700 mb-2 tracking-wide text-xs uppercase"
                  >Trạng thái</label
                >
                <select
                  v-model="newLead.status"
                  class="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 focus:border-pink-500 outline-none transition-all cursor-pointer text-slate-700"
                >
                  <option value="NEW">Mới</option>
                  <option value="CONTACTING">Đang tư vấn</option>
                  <option value="CONTACTED">Đã tư vấn</option>
                  <option value="OPPORTUNITY">Cơ hội</option>
                  <option value="CONVERTED">Đã chốt</option>
                  <option value="LOST">Thất bại</option>
                </select>
              </div>
            </div>

            <div class="pt-4 flex space-x-4">
              <button
                type="button"
                @click="closeLeadModal"
                class="flex-1 px-6 py-3 border-2 border-slate-100 rounded-2xl text-slate-500 font-bold hover:bg-slate-50 transition-all"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                class="flex-1 px-6 py-3 bg-pink-500 text-white rounded-2xl font-bold hover:bg-pink-600 transition-all shadow-lg shadow-pink-100"
              >
                Lưu thông tin
              </button>
            </div>
          </form>
        </div>
      </div>

      <div v-if="isDetailModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div
          class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          @click="closeDetailLeadModal"
        ></div>

        <div
          class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl z-10 overflow-hidden animate-in fade-in zoom-in duration-300 border border-slate-100"
        >
          <div
            class="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50"
          >
            <h3 class="text-xl font-bold text-slate-800">Chi tiết Khách hàng</h3>
            <button
              @click="closeDetailLeadModal"
              class="text-slate-400 hover:text-slate-600 text-3xl"
            >
              &times;
            </button>
          </div>

          <form @submit.prevent="updateLead" class="p-8 space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="md:col-span-2">
                <label
                  class="block text-sm font-bold text-slate-700 mb-2 tracking-wide text-xs uppercase"
                  >Họ và tên</label
                >
                <input
                  v-model="currentLead.name"
                  type="text"
                  required
                  class="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 focus:border-blue-500 outline-none transition-all text-slate-800"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-bold text-slate-700 mb-2 tracking-wide text-xs uppercase"
                  >Điện thoại</label
                >
                <input
                  v-model="currentLead.phone"
                  type="text"
                  class="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 focus:border-blue-500 outline-none transition-all text-slate-800"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-bold text-slate-700 mb-2 tracking-wide text-xs uppercase"
                  >Email</label
                >
                <input
                  v-model="currentLead.email"
                  type="email"
                  class="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 focus:border-blue-500 outline-none transition-all text-slate-800"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-bold text-slate-700 mb-2 tracking-wide text-xs uppercase"
                  >Nguồn</label
                >
                <select
                  v-model="currentLead.source"
                  class="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 focus:border-blue-500 outline-none transition-all cursor-pointer text-slate-800"
                >
                  <option value="Facebook">Facebook</option>
                  <option value="Website">Website</option>
                  <option value="Zalo">Zalo</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div>
                <label
                  class="block text-sm font-bold text-slate-700 mb-2 tracking-wide text-xs uppercase"
                  >Cập nhật Trạng thái</label
                >
                <select
                  v-model="currentLead.status"
                  class="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 focus:border-blue-500 outline-none transition-all cursor-pointer text-slate-800"
                >
                  <option value="NEW">Mới</option>
                  <option value="CONTACTING">Đang tư vấn</option>
                  <option value="CONTACTED">Đã tư vấn</option>
                  <option value="OPPORTUNITY">Cơ hội</option>
                  <option value="CONVERTED">Đã chốt</option>
                  <option value="LOST">Thất bại</option>
                </select>
              </div>
            </div>

            <div>
              <label
                class="block text-sm font-bold text-slate-700 mb-2 tracking-wide text-xs uppercase"
                >Nhật ký tư vấn (Ghi chú)</label
              >
              <textarea
                v-model="currentLead.notes"
                rows="3"
                class="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 focus:border-blue-500 outline-none transition-all resize-none placeholder:text-slate-300"
                placeholder="VD: Đã gọi lúc 10h, khách hẹn mai gọi lại..."
              ></textarea>
            </div>

            <div class="pt-4 flex space-x-4">
              <button
                type="button"
                @click="closeDetailLeadModal"
                class="flex-1 px-6 py-3 border-2 border-slate-100 rounded-2xl text-slate-500 font-bold hover:bg-slate-50 transition-all"
              >
                Đóng
              </button>
              <button
                type="submit"
                class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
              >
                Cập nhật thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>
