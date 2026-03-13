<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import AdminSidebar from '@/components/AdminSidebar.vue'
import {
  DollarSign,
  Package,
  Utensils,
  RefreshCcw,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Loader2,
  TrendingUp,
  ChevronRight,
  Target,
  Users,
  PhoneCall,
  MessageSquare,
  Star,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-vue-next'

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

const leadStats = computed(() => {
  const leads = rawLeads.value
  return {
    total: leads.length,
    NEW: leads.filter((l) => l.status === 'NEW').length,
    CONTACTING: leads.filter((l) => l.status === 'CONTACTING').length,
    CONTACTED: leads.filter((l) => l.status === 'CONTACTED').length,
    OPPORTUNITY: leads.filter((l) => l.status === 'OPPORTUNITY').length,
    CONVERTED: leads.filter((l) => l.status === 'CONVERTED').length,
    LOST: leads.filter((l) => l.status === 'LOST').length,
  }
})

const isLoading = ref(true)

// Hàm lấy icon tương ứng với từng trạng thái
const getStatusIcon = (key: string) => {
  switch (key) {
    case 'pending':
      return Clock
    case 'processing':
      return Loader2
    case 'shipped':
      return Truck
    case 'completed':
      return CheckCircle
    case 'cancelled':
      return XCircle
    default:
      return Package
  }
}

const getStatusColorClass = (key: string) => {
  const colors: Record<string, string> = {
    pending: 'text-amber-500 bg-amber-50',
    processing: 'text-blue-500 bg-blue-50',
    shipped: 'text-indigo-500 bg-indigo-50',
    completed: 'text-green-500 bg-green-50',
    cancelled: 'text-red-500 bg-red-50',
  }
  return colors[key] || 'text-slate-400 bg-slate-50'
}

// Hàm lấy icon tương ứng với trạng thái Lead
const getLeadStatusIcon = (key: string) => {
  switch (key) {
    case 'NEW':
      return Users
    case 'CONTACTING':
      return PhoneCall
    case 'CONTACTED':
      return MessageSquare
    case 'OPPORTUNITY':
      return Star
    case 'CONVERTED':
      return ThumbsUp
    case 'LOST':
      return ThumbsDown
    default:
      return Target
  }
}

const getLeadStatusColorClass = (key: string) => {
  const colors: Record<string, string> = {
    NEW: 'text-blue-500 bg-blue-50',
    CONTACTING: 'text-purple-500 bg-purple-50',
    CONTACTED: 'text-indigo-500 bg-indigo-50',
    OPPORTUNITY: 'text-amber-500 bg-amber-50',
    CONVERTED: 'text-green-500 bg-green-50',
    LOST: 'text-red-500 bg-red-50',
  }
  return colors[key] || 'text-slate-400 bg-slate-50'
}

const rawLeads = ref<any[]>([])

const fetchStats = async () => {
  isLoading.value = true
  try {
    // Gọi song song 2 API để lấy số liệu thống kê đơn hàng và khách tiềm năng
    const [statsResponse, leadStatsResponse] = await Promise.all([
      api.get('/admin/stats'),
      api.get('leads'),
    ])
    stats.value = statsResponse.data
    rawLeads.value = leadStatsResponse.data
  } catch (error) {
    console.error('Lỗi khi tải số liệu thống kê:', error)
  } finally {
    setTimeout(() => {
      isLoading.value = false
    }, 500)
  }
}

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
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight text-pink-500">
            Bảng điều khiển
          </h1>
          <p class="text-slate-500 mt-1 text-sm font-medium">
            Chào mừng trở lại, hệ thống đang hoạt động tốt.
          </p>
        </div>
        <button
          @click="fetchStats"
          class="p-2 hover:rotate-180 transition-all duration-500 text-slate-400 hover:text-pink-500 bg-white rounded-full shadow-sm"
        >
          <RefreshCcw :size="20" :class="{ 'animate-spin': isLoading }" />
        </button>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-10">
        <div
          class="relative overflow-hidden bg-gradient-to-br from-pink-500 to-rose-600 p-8 rounded-[2rem] shadow-xl shadow-pink-200 text-white"
        >
          <div class="relative z-10">
            <div
              class="flex items-center gap-2 text-pink-100 text-sm font-bold uppercase tracking-widest"
            >
              <TrendingUp :size="16" />
              Tổng doanh thu
            </div>
            <h3 class="text-4xl font-black mt-3">{{ formatCurrency(stats.totalRevenue) }}</h3>
          </div>
          <DollarSign class="absolute -right-4 -bottom-4 text-white/10" :size="160" />
        </div>

        <div
          class="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between group hover:border-blue-200 transition-all"
        >
          <div>
            <div
              class="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4"
            >
              <Package :size="24" />
            </div>
            <p class="text-slate-500 text-sm font-bold uppercase tracking-wider">Tổng đơn hàng</p>
            <h3 class="text-4xl font-black text-slate-800 mt-2">{{ stats.totalOrders }}</h3>
          </div>
          <button
            @click="$router.push('/admin/orders')"
            class="flex items-center text-slate-400 text-xs font-bold mt-4 hover:text-pink-500 transition-colors"
          >
            Quản lý đơn hàng <ChevronRight :size="14" class="ml-1" />
          </button>
        </div>

        <div
          class="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between group hover:border-orange-200 transition-all"
        >
          <div>
            <div
              class="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-4"
            >
              <Utensils :size="24" />
            </div>
            <p class="text-slate-500 text-sm font-bold uppercase tracking-wider">
              Sản phẩm hiện có
            </p>
            <h3 class="text-4xl font-black text-slate-800 mt-2">{{ stats.totalProducts }}</h3>
          </div>
          <button
            @click="$router.push('/admin/products')"
            class="flex items-center text-slate-400 text-xs font-bold mt-4 hover:text-pink-500 transition-colors"
          >
            Quản lý sản phẩm <ChevronRight :size="14" class="ml-1" />
          </button>
        </div>

        <div
          class="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between group hover:border-purple-200 transition-all"
        >
          <div>
            <div
              class="w-12 h-12 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center mb-4"
            >
              <Target :size="24" />
            </div>
            <p class="text-slate-500 text-sm font-bold uppercase tracking-wider">Khách tiềm năng</p>
            <h3 class="text-4xl font-black text-slate-800 mt-2">{{ leadStats.total }}</h3>
          </div>
          <button
            @click="$router.push('/admin/leads')"
            class="flex items-center text-slate-400 text-xs font-bold mt-4 hover:text-pink-500 transition-colors"
          >
            Quản lý Leads <ChevronRight :size="14" class="ml-1" />
          </button>
        </div>
      </div>
      <h2 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
        <span class="w-2 h-6 bg-purple-500 rounded-full"></span>
        Trạng thái Khách tiềm năng
      </h2>

      <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-10">
        <div
          v-for="(val, key) in {
            NEW: 'Mới',
            CONTACTING: 'Đang tư vấn',
            CONTACTED: 'Đã tư vấn',
            OPPORTUNITY: 'Cơ hội',
            CONVERTED: 'Đã chốt',
            LOST: 'Thất bại',
          }"
          :key="key"
          class="group bg-white p-6 rounded-2xl border border-slate-100 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-50 transition-all cursor-default"
        >
          <div class="flex justify-between items-start mb-4">
            <p
              class="text-[10px] font-black uppercase tracking-tighter text-slate-400 group-hover:text-purple-400 transition-colors"
            >
              {{ val }}
            </p>
            <div :class="getLeadStatusColorClass(key)" class="p-2 rounded-lg transition-colors">
              <component :is="getLeadStatusIcon(key)" :size="16" />
            </div>
          </div>
          <p class="text-3xl font-black text-slate-700">
            {{ leadStats[key as keyof typeof leadStats] }}
          </p>
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
          class="group bg-white p-6 rounded-2xl border border-slate-100 hover:border-pink-200 hover:shadow-lg hover:shadow-pink-50 transition-all cursor-default"
        >
          <div class="flex justify-between items-start mb-4">
            <p
              class="text-[10px] font-black uppercase tracking-tighter text-slate-400 group-hover:text-pink-400 transition-colors"
            >
              {{ val }}
            </p>
            <div :class="getStatusColorClass(key)" class="p-2 rounded-lg transition-colors">
              <component
                :is="getStatusIcon(key)"
                :size="16"
                :class="{ 'animate-spin': key === 'processing' && isLoading }"
              />
            </div>
          </div>
          <p class="text-3xl font-black text-slate-700">{{ stats[key] }}</p>
        </div>
      </div>
    </main>
  </div>
</template>
