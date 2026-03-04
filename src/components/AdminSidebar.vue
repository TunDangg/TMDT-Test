<template>
  <aside class="w-72 bg-slate-900 text-slate-300 min-h-screen shadow-xl flex flex-col shrink-0">
    <div class="p-6 border-b border-slate-800">
      <h2 class="text-2xl font-extrabold text-white tracking-tight">
        TMDT <span class="text-pink-500 italic">Admin</span>
      </h2>
    </div>

    <nav class="flex-1 p-4 space-y-2">
      <router-link
        to="/admin"
        class="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 hover:text-white transition-all group"
        active-class="bg-pink-600 text-white"
      >
        <span>📊</span>
        <span class="font-medium">Bảng điều khiển</span>
      </router-link>

      <router-link
        to="/admin/leads"
        class="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 hover:text-white transition-all group"
        active-class="bg-pink-600 text-white"
      >
        <span>🎯</span>
        <span class="font-medium">Khách hàng tiềm năng</span>
      </router-link>

      <router-link
        to="/admin/products"
        class="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 hover:text-white transition-all group"
        active-class="bg-pink-600 text-white"
      >
        <span>🍔</span>
        <span class="font-medium">Quản lý sản phẩm</span>
      </router-link>

      <router-link
        to="/admin/orders"
        class="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 hover:text-white transition-all group"
      >
        <span>📜</span>
        <span class="font-medium">Quản lý đơn hàng</span>
      </router-link>
    </nav>

    <div class="p-4 border-t border-slate-800">
      <router-link
        to="/"
        class="flex items-center space-x-3 p-3 text-sm text-slate-400 hover:text-white transition-all"
      >
        <span>⬅</span>
        <span>Quay lại cửa hàng</span>
      </router-link>
    </div>
  </aside>
</template>
