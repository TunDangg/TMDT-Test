<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminSidebar from '@/components/AdminSidebar.vue'
import { useToast } from 'vue-toastification'
import api from '@/services/api'

// Sử dụng các icon lucide để không bị lỗi hiển thị
import {
  ArrowLeft,
  Copy,
  User,
  Phone,
  Mail,
  MapPin,
  MousePointerClick,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Pencil,
  Trash2,
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const toast = useToast()

// Lấy ID từ URL nếu có, nếu không dùng tạm ID mẫu
const leadId = ref(route.params.id || 'LEAD-8829')

// Dữ liệu mẫu (Mock data) - Giữ nguyên thông tin từ tool gen
const leadInfo = ref({
  name: '...',
  phone: '...',
  email: '...',
  address: '...',
  source: '...',
  createdAt: '...',
  status: '...',
})

const isEditingInfo = ref(false)
const editForm = ref({ ...leadInfo.value })
const editingActivityId = ref<number | null>(null)
const editNoteContent = ref('')

const fetchLeadData = async () => {
  try {
    const response = await api.get(`/leads/${leadId.value}`)
    const data = response.data

    // Đổ dữ liệu thật vào biến leadInfo
    leadInfo.value = {
      name: data.name,
      phone: data.phone || 'Chưa cập nhật',
      email: data.email || 'Chưa cập nhật',
      address: data.address || 'Chưa cập nhật',
      source: data.source || 'Website',
      createdAt: new Date(data.created_at).toLocaleDateString('vi-VN'),
      status: data.status,
    }

    // Đổ mảng nhật ký (activities) vào timeline
    if (data.activities && data.activities.length > 0) {
      timeline.value = data.activities.map((act: any) => ({
        id: act.id,
        // Format ngày giờ Việt Nam: DD/MM/YYYY - HH:mm
        time: new Intl.DateTimeFormat('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date(act.created_at)),
        role: act.role,
        content: act.content,
        type: act.type,
      }))
    } else {
      timeline.value = []
    }
  } catch (error) {
    console.error('Lỗi khi tải chi tiết:', error)
    toast.error('Không thể tải thông tin khách hàng!')
  }
}

const openEditInfo = () => {
  editForm.value = { ...leadInfo.value }
  isEditingInfo.value = true
}

const cancelEditInfo = () => {
  isEditingInfo.value = false
}

const saveEditInfo = async () => {
  try {
    const updateData = {
      name: editForm.value.name,
      phone: editForm.value.phone,
      email: editForm.value.email,
      address: editForm.value.address,
      source: editForm.value.source,
      status: editForm.value.status,
    }
    await api.patch(`/leads/${leadId.value}`, updateData)

    toast.success('Thông tin khách hàng đã được cập nhật!', {
      timeout: 3000,
    })

    await fetchLeadData()
    isEditingInfo.value = false
  } catch (error) {
    console.error('Lỗi khi cập nhật', error)
    toast.error('Lỗi hệ thống, vui lòng thử lại')
  }
}

const getStatusLabel = (status: string) => {
  const statusMap: Record<string, { label: string; class: string }> = {
    NEW: { label: 'Mới', class: 'bg-blue-100 text-blue-700 border-blue-200' },
    CONTACTING: { label: 'Đang tư vấn', class: 'bg-purple-100 text-purple-700 border-purple-200' },
    CONTACTED: { label: 'Đã tư vấn', class: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    OPPORTUNITY: { label: 'Cơ hội', class: 'bg-orange-100 text-orange-700 border-orange-200' },
    CONVERTED: { label: 'Đã chốt', class: 'bg-green-100 text-green-700 border-green-200' },
    LOST: { label: 'Thất bại', class: 'bg-red-100 text-red-700 border-red-200' },
  }
  return statusMap[status] || { label: status, class: 'bg-slate-100 text-slate-700' }
}

// Bắt đầu sửa
const startEditActivity = (item: any) => {
  editingActivityId.value = item.id
  editNoteContent.value = item.content
}

// Lưu sửa đổi
const handleUpdateActivity = async (id: number) => {
  try {
    await api.patch(`/leads/activities/${id}`, { content: editNoteContent.value })
    toast.success('Đã cập nhật ghi chú')
    editingActivityId.value = null
    await fetchLeadData() // Tải lại danh sách timeline
  } catch (error) {
    toast.error('Lỗi khi cập nhật ghi chú')
  }
}

// Xóa ghi chú
const handleDeleteActivity = async (id: number) => {
  if (!confirm('Bạn có chắc chắn muốn xóa ghi chú này?')) return
  try {
    await api.delete(`/leads/activities/${id}`)
    toast.success('Đã xóa ghi chú')
    await fetchLeadData()
  } catch (error) {
    toast.error('Lỗi khi xóa ghi chú')
  }
}

const cancelEditActivity = () => {
  editingActivityId.value = null
  editNoteContent.value = ''
}

const noteContent = ref('')

// Timeline mẫu
const timeline = ref<any>([])

const productsOfInterest = ref([
  { id: 1, name: 'Happy Meal x Crayon ShinChan', price: '85.000đ' },
  { id: 2, name: 'Mì Cay Cấp Độ 7', price: '65.000đ' },
])

const tags = ref(['VIP Potential', 'Haidilao', 'HN_City'])

// Hàm quay lại
const goBack = () => {
  router.push('/admin/leads')
}

const saveNote = async () => {
  if (!noteContent.value.trim()) {
    toast.warning('Vui lòng nhập nội dung ghi chú trước khi lưu.', {
      timeout: 3000,
    })
    return
  }

  try {
    await api.post(`/leads/${leadId.value}/activities`, {
      content: noteContent.value,
      type: 'note',
      role: 'ADMIN',
    })

    toast.success('Ghi chú đã được lưu thành công!', {
      timeout: 3000,
    })
    noteContent.value = ''

    await fetchLeadData()
  } catch (error) {
    console.error('Lỗi khi lưu', error)
    toast.error('Lỗi hệ thống, vui lòng thử lại')
  }
}

onMounted(() => {
  fetchLeadData()
})
</script>

<template>
  <div class="flex w-full bg-slate-50 min-h-screen font-sans">
    <AdminSidebar />

    <main class="flex-1 w-full p-4 sm:p-6 overflow-visible pt-10">
      <div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <button
            @click="goBack"
            class="flex items-center gap-2 text-blue-600 font-semibold text-sm mb-4 hover:underline"
          >
            <ArrowLeft :size="16" />
            Quay lại danh sách
          </button>
          <div class="flex items-center gap-3">
            <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">
              Chi tiết khách hàng: {{ leadInfo.name }}
            </h2>
            <span
              class="px-2 py-0.5 bg-slate-200 text-slate-600 text-xs font-bold rounded uppercase tracking-wider"
            >
              ID: #{{ leadId }}
            </span>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <template v-if="isEditingInfo">
            <button
              @click="cancelEditInfo"
              class="px-5 py-2.5 rounded-xl border border-red-300 text-red-600 font-bold text-sm hover:bg-red-50 transition-colors"
            >
              Hủy
            </button>
            <button
              @click="saveEditInfo"
              class="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition-colors"
            >
              Lưu thay đổi
            </button>
          </template>
          <button
            v-if="!isEditingInfo"
            @click="openEditInfo"
            class="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-100 transition-colors"
          >
            Chỉnh sửa
          </button>
          <button
            class="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <CheckCircle2 :size="16" />
            Chuyển thành Đơn hàng
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-visible">
        <div class="lg:col-span-1 space-y-6">
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div class="flex flex-col items-center text-center mb-8 overflow-visible">
              <div
                class="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mb-4 border-4 border-white shadow-sm overflow-hidden"
              >
                <User :size="40" />
              </div>
              <h3 class="text-xl font-bold text-slate-900">{{ leadInfo.name }}</h3>
              <div
                class="flex items-center gap-1 text-slate-500 text-sm mt-1 relative overflow-visible"
              >
                <span>ID: #{{ leadId }}</span>
                <button
                  class="text-slate-400 hover:text-blue-600 transition-colors cursor-pointer relative z-10"
                >
                  <Copy :size="14" />
                </button>
              </div>
              <div class="mt-4">
                <span
                  :class="[
                    'px-3 py-1 text-xs font-bold rounded-full border tracking-wide uppercase',
                    getStatusLabel(leadInfo.status).class,
                  ]"
                >
                  {{ getStatusLabel(leadInfo.status).label }}
                </span>
              </div>
            </div>

            <div v-if="!isEditingInfo" class="space-y-5 border-t border-slate-100 pt-6">
              <div class="flex items-start gap-3">
                <Phone :size="16" class="text-slate-400 mt-0.5" />
                <div class="flex-1 relative overflow-visible">
                  <p class="text-xs text-slate-500 font-medium uppercase tracking-wider">
                    Số điện thoại
                  </p>
                  <div
                    class="flex items-center justify-between mt-1 relative overflow-visible z-10"
                  >
                    <p class="text-sm font-semibold text-slate-800">{{ leadInfo.phone }}</p>
                    <button class="text-slate-400 hover:text-blue-600 relative z-20">
                      <Copy :size="14" />
                    </button>
                  </div>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Mail :size="16" class="text-slate-400 mt-0.5" />
                <div class="flex-1">
                  <p class="text-xs text-slate-500 font-medium uppercase tracking-wider">Email</p>
                  <p class="text-sm font-semibold text-slate-800 mt-1">{{ leadInfo.email }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <MapPin :size="16" class="text-slate-400 mt-0.5" />
                <div class="flex-1">
                  <p class="text-xs text-slate-500 font-medium uppercase tracking-wider">Địa chỉ</p>
                  <p class="text-sm font-semibold text-slate-800 mt-1 leading-relaxed">
                    {{ leadInfo.address }}
                  </p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <MousePointerClick :size="16" class="text-slate-400 mt-0.5" />
                <div class="flex-1">
                  <p class="text-xs text-slate-500 font-medium uppercase tracking-wider">
                    Nguồn khách hàng
                  </p>
                  <p class="text-sm font-semibold text-slate-800 mt-1">{{ leadInfo.source }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Calendar :size="16" class="text-slate-400 mt-0.5" />
                <div class="flex-1">
                  <p class="text-xs text-slate-500 font-medium uppercase tracking-wider">
                    Ngày tạo
                  </p>
                  <p class="text-sm font-semibold text-slate-800 mt-1">{{ leadInfo.createdAt }}</p>
                </div>
              </div>
            </div>

            <!-- Chỉnh sửa -->
            <div v-else class="space-y-5 border-t border-slate-100 pt-6">
              <div class="flex items-start gap-3">
                <User :size="16" class="text-slate-400 mt-0.5" />
                <div class="flex-1">
                  <p class="text-xs text-slate-500 font-medium uppercase tracking-wider">Họ tên</p>
                  <input
                    v-model="editForm.name"
                    type="text"
                    class="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm text-slate-800 outline-none transition-all"
                    placeholder="Nhập họ tên khách hàng"
                  />
                </div>
              </div>

              <div class="flex items-start gap-3">
                <Phone :size="16" class="text-slate-400 mt-0.5" />
                <div class="flex-1">
                  <p class="text-xs text-slate-500 font-medium uppercase tracking-wider">
                    Số điện thoại
                  </p>
                  <input
                    v-model="editForm.phone"
                    type="tel"
                    class="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm text-slate-800 outline-none transition-all"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>

              <div class="flex items-start gap-3">
                <Mail :size="16" class="text-slate-400 mt-0.5" />
                <div class="flex-1">
                  <p class="text-xs text-slate-500 font-medium uppercase tracking-wider">Email</p>
                  <input
                    v-model="editForm.email"
                    type="email"
                    class="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm text-slate-800 outline-none transition-all"
                    placeholder="Nhập email"
                  />
                </div>
              </div>

              <div class="flex items-start gap-3">
                <MapPin :size="16" class="text-slate-400 mt-0.5" />
                <div class="flex-1">
                  <p class="text-xs text-slate-500 font-medium uppercase tracking-wider">Địa chỉ</p>
                  <textarea
                    v-model="editForm.address"
                    rows="2"
                    class="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm text-slate-800 outline-none transition-all resize-none"
                    placeholder="Nhập địa chỉ liên hệ"
                  ></textarea>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <MousePointerClick :size="16" class="text-slate-400 mt-0.5" />
                <div class="flex-1">
                  <p class="text-xs text-slate-500 font-medium uppercase tracking-wider">
                    Nguồn khách hàng
                  </p>
                  <input
                    v-model="editForm.source"
                    type="text"
                    class="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm text-slate-800 outline-none transition-all"
                    placeholder="VD: Website, Facebook..."
                  />
                </div>
              </div>

              <div class="flex items-start gap-3">
                <Calendar :size="16" class="text-slate-400 mt-0.5" />
                <div class="flex-1">
                  <p class="text-xs text-slate-500 font-medium uppercase tracking-wider">
                    Trạng thái
                  </p>
                  <select
                    v-model="editForm.status"
                    class="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm text-slate-800 outline-none transition-all bg-white"
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
            </div>

            <button
              class="w-full mt-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-green-100 active:scale-95"
            >
              <Phone :size="18" class="fill-white" />
              Gọi điện ngay
            </button>
          </div>
        </div>

        <div class="lg:col-span-2 space-y-8">
          <div class="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
            <div class="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 class="text-lg font-bold text-slate-800 mb-4 tracking-tight">Nhật ký trao đổi</h3>
              <div class="relative">
                <textarea
                  v-model="noteContent"
                  class="w-full min-h-[120px] p-4 bg-white rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm outline-none resize-none transition-all placeholder:text-slate-300"
                  placeholder="Nhập nội dung trao đổi với khách hàng..."
                ></textarea>
                <div class="flex justify-end mt-3">
                  <button
                    @click="saveNote"
                    class="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-100 active:scale-95"
                  >
                    Lưu ghi chú
                  </button>
                </div>
              </div>
            </div>

            <div class="p-8">
              <div class="relative border-l-2 border-slate-100 ml-3 space-y-10">
                <div
                  v-if="timeline.length === 0"
                  class="text-center text-slate-400 text-sm italic py-4"
                >
                  Chưa có lịch sử trao đổi nào.
                </div>
                <div v-for="item in timeline" :key="item.id" class="relative pl-8">
                  <div
                    class="absolute -left-[11px] top-0 w-5 h-5 rounded-full ring-4 ring-white flex items-center justify-center shadow-sm"
                    :class="item.type === 'call' ? 'bg-blue-600' : 'bg-slate-300'"
                  >
                    <Phone v-if="item.type === 'call'" :size="10" class="text-white fill-white" />
                  </div>

                  <div class="flex items-center justify-between gap-3 mb-1">
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-bold text-slate-900">{{ item.time }}</span>
                      <span
                        class="px-2 py-0.5 text-[10px] font-extrabold rounded uppercase tracking-tighter"
                        :class="
                          item.role === 'ADMIN'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-600'
                        "
                      >
                        {{ item.role }}
                      </span>
                    </div>
                    <div class="flex items-center gap-2">
                      <button
                        v-if="editingActivityId !== item.id"
                        @click="startEditActivity(item)"
                        class="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <Pencil :size="14" />
                      </button>
                      <button
                        v-if="editingActivityId !== item.id"
                        @click="handleDeleteActivity(item.id)"
                        class="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 :size="14" />
                      </button>
                    </div>
                  </div>

                  <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-2">
                    <template v-if="editingActivityId === item.id">
                      <textarea
                        v-model="editNoteContent"
                        rows="3"
                        class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm text-slate-800 outline-none transition-all resize-none"
                      ></textarea>
                      <div class="flex justify-end gap-2 mt-3">
                        <button
                          @click="cancelEditActivity"
                          class="px-4 py-2 text-sm font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                          Hủy
                        </button>
                        <button
                          @click="handleUpdateActivity(item.id)"
                          class="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
                        >
                          Lưu
                        </button>
                      </div>
                    </template>
                    <template v-else>
                      <p class="text-sm text-slate-600 leading-relaxed font-medium">
                        {{ item.content }}
                      </p>
                    </template>
                  </div>
                </div>
              </div>

              <div class="mt-10 flex justify-center">
                <button
                  class="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1.5"
                >
                  Xem thêm hoạt động
                  <ChevronDown :size="16" />
                </button>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h4 class="font-bold text-slate-800 mb-5 tracking-tight">Sản phẩm quan tâm</h4>
              <div class="space-y-4">
                <div
                  v-for="product in productsOfInterest"
                  :key="product.id"
                  class="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border border-slate-50 hover:border-slate-100"
                >
                  <div
                    class="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-100"
                  >
                    <User :size="24" class="text-slate-300" />
                  </div>
                  <div>
                    <p class="text-sm font-bold text-slate-900 truncate">{{ product.name }}</p>
                    <p class="text-sm text-blue-600 font-extrabold mt-0.5">{{ product.price }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <h4 class="font-bold text-slate-800 mb-5 tracking-tight">Thẻ định danh (Tags)</h4>
              <div class="flex flex-wrap gap-2.5">
                <span
                  v-for="tag in tags"
                  :key="tag"
                  class="px-3.5 py-1.5 bg-blue-100 text-blue-800 text-xs font-bold rounded-full border border-blue-200 tracking-wide"
                >
                  {{ tag }}
                </span>
                <button
                  class="px-3 py-1.5 border border-dashed border-slate-300 text-slate-500 rounded-full text-xs font-bold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center gap-1"
                >
                  + Thêm thẻ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
