<script setup lang="ts">
import { ref } from 'vue'
import AdminSidebar from '@/components/AdminSidebar.vue'

// Dữ liệu mẫu khách hàng tiềm năng
const leads = [
  {
    id: 101,
    name: 'Nguyễn Văn A',
    phone: '0987654321',
    email: 'nva@gmail.com',
    status: 'Mới',
    source: 'Facebook',
  },
  {
    id: 102,
    name: 'Trần Thị B',
    phone: '0912345678',
    email: 'ttb@gmail.com',
    status: 'Đang tư vấn',
    source: 'Website',
  },
  {
    id: 103,
    name: 'Lê Văn C',
    phone: '0909090909',
    email: 'lvc@gmail.com',
    status: 'Đã chốt',
    source: 'Giới thiệu',
  },
]

const newLead = ref({
  name: '',
  phone: '',
  email: '',
  source: 'Website',
  status: 'Mới',
})

const isModalOpen = ref(false)

const openLeadModal = () => {
  isModalOpen.value = true
}

const closeLeadModal = () => {
  isModalOpen.value = false
  //Reset form sau khi đóng
  newLead.value = {
    name: '',
    phone: '',
    email: '',
    source: 'Website',
    status: 'Mới',
  }
}

const submitLead = () => {
  // Tam thoi push vao mang lead hien tai de test giao dien, sau nay se thay bang API call de them lead vao database
  const id = Math.floor(Math.random() * 1000)
  leads.push({ id, ...newLead.value })
  closeLeadModal()
  // sau nay o giai doan 2 ban se goi api.post('/leads', newLead.value) de them lead vao database, sau do goi lai API de lay danh sach lead moi nhat ve hien thi.
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Mới':
      return 'bg-blue-100 text-blue-700'
    case 'Đang tư vấn':
      return 'bg-yellow-100 text-yellow-700'
    case 'Đã chốt':
      return 'bg-green-100 text-green-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}
</script>

<template>
  <div class="flex w-full bg-slate-50 min-h-screen font-sans">
    <AdminSidebar />

    <main class="flex-1 w-full p-4 sm:p-6 overflow-x-hidden">
      <header class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-slate-800">Khách hàng tiềm năng (Leads)</h1>
          <p class="text-slate-500 mt-1">Quản lý và theo dõi khách hàng</p>
        </div>
      </header>

      <section
        class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden w-full"
      >
        <div
          class="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4"
        >
          <div class="flex items-center gap-2 flex-1 min-w-[300px]">
            <input
              type="text"
              placeholder="Tìm kiếm khách hàng..."
              class="w-full pl-10 pr-4 h-11 border border-slate-200 rounded-xl focus:border-pink-500 outline-none text-sm transition-all"
            />
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

        <div class="overflow-x-auto w-full">
          <table class="w-full text-left border-collapse min-w-full">
            <thead>
              <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th class="p-4 font-semibold">ID</th>
                <th class="p-4 font-semibold">Họ & Tên</th>
                <th class="p-4 font-semibold">Số điện thoại</th>
                <th class="p-4 font-semibold">Nguồn</th>
                <th class="p-4 font-semibold text-center">Trạng thái</th>
                <th class="p-4 font-semibold text-center">Hành động</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <tr v-for="lead in leads" :key="lead.id" class="hover:bg-slate-50 transition-colors">
                <td class="p-4 font-mono text-slate-400 text-xs">#{{ lead.id }}</td>
                <td class="p-4 font-bold">{{ lead.name }}</td>
                <td class="p-4 text-sm">{{ lead.phone }}</td>
                <td class="p-4 text-sm text-slate-500">{{ lead.source }}</td>
                <td class="p-4 text-center">
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider',
                      getStatusColor(lead.status),
                    ]"
                  >
                    {{ lead.status }}
                  </span>
                </td>
                <td class="p-4 text-center whitespace-nowrap">
                  <button class="text-blue-500 hover:text-blue-700 mr-3 text-sm font-bold">
                    Chi tiết
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Modal thêm lead mới -->
      <div v-if="isModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div
          class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          @click="closeLeadModal"
        ></div>

        <div
          class="bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 overflow-hidden animate-in fade-in zoom-in duration-300"
        >
          <div class="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 class="text-xl font-bold text-slate-800">Thêm khách hàng mới</h3>
            <button @click="closeLeadModal" class="text-slate-400 hover:text-slate-600 text-2xl">
              &times;
            </button>
          </div>

          <form @submit.prevent="submitLead" class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1">Họ và Tên</label>
              <input
                v-model="newLead.name"
                type="text"
                required
                class="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 outline-none"
                placeholder="VD: Nguyễn Văn A"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1">Số điện thoại</label>
              <input
                v-model="newLead.phone"
                type="text"
                required
                class="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 outline-none"
                placeholder="0987..."
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1">Nguồn</label>
                <select
                  v-model="newLead.source"
                  class="w-full border border-slate-300 rounded-lg px-4 py-2 outline-none"
                >
                  <option value="Facebook">Facebook</option>
                  <option value="Website">Website</option>
                  <option value="Zalo">Zalo</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1">Trạng thái</label>
                <select
                  v-model="newLead.status"
                  class="w-full border border-slate-300 rounded-lg px-4 py-2 outline-none"
                >
                  <option value="Mới">Mới</option>
                  <option value="Đang tư vấn">Đang tư vấn</option>
                </select>
              </div>
            </div>

            <div class="pt-4 flex space-x-3">
              <button
                type="button"
                @click="closeLeadModal"
                class="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-bold hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                class="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg font-bold hover:bg-pink-600 transition-colors shadow-lg shadow-pink-200"
              >
                Lưu thông tin
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>
