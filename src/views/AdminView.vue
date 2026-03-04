<script setup lang="ts">
import AdminSidebar from '@/components/AdminSidebar.vue'
</script>

<template>
  <div class="flex w-full bg-slate-50 min-h-screen font-sans">
    <AdminSidebar />

    <main class="flex-1 w-full p-4 sm:p-6 overflow-x-hidden">
      <header class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-slate-800">Tổng quan hệ thống</h1>
          <p class="text-slate-500 mt-1">Dữ liệu kinh doanh tính đến hôm nay</p>
        </div>
        <div class="flex items-center space-x-4">
          <span class="text-sm font-medium bg-green-100 text-green-700 px-3 py-1 rounded-full"
            >Hệ thống: Ổn định</span
          >
          <div
            class="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-md"
          >
            AD
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full">
        <div
          class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4"
        >
          <div class="p-4 bg-pink-50 text-pink-500 rounded-xl text-2xl">💰</div>
          <div>
            <p class="text-slate-500 text-sm font-medium">Doanh thu tháng</p>
            <p class="text-2xl font-bold text-slate-800">12.500.000đ</p>
          </div>
        </div>

        <div
          class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4"
        >
          <div class="p-4 bg-blue-50 text-blue-500 rounded-xl text-2xl">📦</div>
          <div>
            <p class="text-slate-500 text-sm font-medium">Đơn hàng mới</p>
            <p class="text-2xl font-bold text-slate-800">48</p>
          </div>
        </div>

        <div
          class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4"
        >
          <div class="p-4 bg-orange-50 text-orange-500 rounded-xl text-2xl">👤</div>
          <div>
            <p class="text-slate-500 text-sm font-medium">Khách hàng mới</p>
            <p class="text-2xl font-bold text-slate-800">156</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
