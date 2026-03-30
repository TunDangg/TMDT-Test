<template>
  <aside
    class="w-72 bg-slate-900 text-slate-300 h-screen sticky top-0 shadow-xl flex flex-col shrink-0"
  >
    <div class="p-8 border-b border-slate-800/50">
      <h2 class="text-2xl font-black text-white tracking-tighter">
        EDTEXCO <span class="text-pink-500 italic font-medium">Admin</span>
      </h2>
    </div>

    <nav class="flex-1 p-4 space-y-2 mt-4">
      <router-link
        to="/admin"
        class="flex items-center space-x-3 p-3.5 rounded-xl hover:bg-slate-800 hover:text-white transition-all group"
        active-class="bg-pink-600 text-white shadow-lg shadow-pink-900/20"
      >
        <LayoutDashboard :size="20" class="group-hover:scale-110 transition-transform" />
        <span class="font-bold text-xs uppercase tracking-widest">Dashboard</span>
      </router-link>

      <router-link
        to="/admin/leads"
        class="flex items-center space-x-3 p-3.5 rounded-xl hover:bg-slate-800 hover:text-white transition-all group"
        active-class="bg-pink-600 text-white shadow-lg shadow-pink-900/20"
      >
        <Target :size="20" class="group-hover:scale-110 transition-transform" />
        <span class="font-bold text-xs uppercase tracking-widest">Khách tiềm năng</span>
      </router-link>

      <router-link
        to="/admin/products"
        class="flex items-center space-x-3 p-3.5 rounded-xl hover:bg-slate-800 hover:text-white transition-all group"
        active-class="bg-pink-600 text-white shadow-lg shadow-pink-900/20"
      >
        <ShoppingBag :size="20" class="group-hover:scale-110 transition-transform" />
        <span class="font-bold text-xs uppercase tracking-widest">Quản lý sản phẩm</span>
      </router-link>

      <router-link
        to="/admin/vouchers"
        class="flex items-center space-x-3 p-3.5 rounded-xl hover:bg-slate-800 hover:text-white transition-all group"
        active-class="bg-pink-600 text-white shadow-lg shadow-pink-900/20"
      >
        <Ticket :size="20" class="group-hover:scale-110 transition-transform" />
        <span class="font-bold text-xs uppercase tracking-widest">Quản lý khuyến mãi</span>
      </router-link>

      <router-link
        to="/admin/orders"
        class="flex items-center space-x-3 p-3.5 rounded-xl hover:bg-slate-800 hover:text-white transition-all group"
        active-class="bg-pink-600 text-white shadow-lg shadow-pink-900/20"
      >
        <ClipboardList :size="20" class="group-hover:scale-110 transition-transform" />
        <span class="font-bold text-xs uppercase tracking-widest">Quản lý đơn hàng</span>
      </router-link>
    </nav>

    <div class="p-4 border-t border-slate-800/50">
      <router-link
        to="/"
        class="flex items-center space-x-3 p-3.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group"
      >
        <LogOut :size="18" class="group-hover:-translate-x-1 transition-transform" />
        <span class="font-medium">Quay lại cửa hàng</span>
      </router-link>
    </div>
  </aside>
</template>

<script setup lang="ts">
import {
  LayoutDashboard,
  Target,
  ShoppingBag,
  ClipboardList,
  LogOut,
  Ticket,
} from 'lucide-vue-next'
</script>

<style scoped>
/* Hiệu ứng mượt mà khi chuyển đổi trang */
.router-link-active {
  position: relative;
}

.router-link-active::after {
  content: '';
  position: absolute;
  right: 0;
  top: 20%;
  height: 60%;
  width: 4px;
  background: white;
  border-radius: 4px 0 0 4px;
}
</style>
