<script setup lang="ts">
import { ref } from 'vue'
import AdminSidebar from '@/components/AdminSidebar.vue'

// Dữ liệu sản phẩm (Giai đoạn sau sẽ dùng ref và gọi API)
const products = ref([
  {
    id: 1,
    name: 'Trà Sữa',
    price: 25000,
    description: 'Trà sữa truyền thống trân châu đen dai giòn.',
    image_url:
      'https://mixueviet.com/wp-content/uploads/2024/05/Tra-Sua-Tran-Chau-Duong-Den-Mixue.jpg',
    stock_quantity: 50,
    category: 'Đồ uống',
  },
  {
    id: 2,
    name: 'Gà Rán Cay',
    price: 45000,
    description: 'Gà rán giòn tan sốt cay nồng',
    image_url: '',
    stock_quantity: 20,
    category: 'Món chính',
  },
])

// Logic Modal Thêm Sản Phẩm (Đã làm ở bước trước)
const newProduct = ref({
  name: '',
  price: 0,
  description: '',
  image_url: '',
  stock_quantity: 0,
  category: 'Món chính',
})

const isProductModalOpen = ref(false)

const openProductModal = () => {
  isProductModalOpen.value = true
}

const closeProductModal = () => {
  isProductModalOpen.value = false
  // Reset form sau khi đóng
  newProduct.value = {
    name: '',
    price: 0,
    description: '',
    image_url: '',
    stock_quantity: 0,
    category: 'Món chính',
  }
}

const submitProduct = () => {
  // Giai doan 1 : them tam thoi vao mang de test UI
  const id = products.value.length + 1
  products.value.unshift({ id, ...newProduct.value })

  // Giai doan 2: sau nay se goi API tai day
  // api.post('/products', newProduct.value)

  closeProductModal()
}
</script>

<template>
  <div class="flex w-full bg-slate-50 min-h-screen font-sans text-slate-900">
    <AdminSidebar />

    <main class="flex-1 w-full p-4 sm:p-6 overflow-x-hidden">
      <header class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Quản lý sản phẩm</h1>
          <p class="text-slate-500 mt-1">Quản lý món ăn, giá cả và tồn kho theo thời gian thực</p>
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
              placeholder="Tìm kiếm món ăn..."
              class="w-full pl-10 pr-4 h-11 border border-slate-200 rounded-xl focus:border-pink-500 outline-none text-sm transition-all"
            />
            <button
              class="h-11 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-all"
            >
              Lọc
            </button>
          </div>
          <button
            @click="openProductModal"
            class="h-11 px-6 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-pink-100 flex items-center gap-2"
          >
            <span class="text-lg">+</span> Thêm sản phẩm
          </button>
        </div>

        <div class="overflow-x-auto w-full">
          <table class="w-full text-left border-collapse min-w-full">
            <thead>
              <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th class="p-4 font-semibold">ID</th>
                <th class="p-4 font-semibold">Hình ảnh</th>
                <th class="p-4 font-semibold">Tên sản phẩm</th>
                <th class="p-4 font-semibold text-right">Giá</th>
                <th class="p-4 font-semibold text-center">Tồn kho</th>
                <th class="p-4 font-semibold text-center">Hành động</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <tr
                v-for="item in products"
                :key="item.id"
                class="hover:bg-slate-50/80 transition-colors"
              >
                <td class="p-4 font-mono text-slate-400 text-xs">#00{{ item.id }}</td>
                <td class="p-4">
                  <img
                    :src="item.image_url || 'https://via.placeholder.com/50'"
                    class="w-12 h-12 object-cover rounded-lg border border-slate-100 shadow-sm"
                  />
                </td>
                <td class="p-4 font-bold text-slate-800">
                  {{ item.name }}
                  <div class="text-[10px] text-orange-600 font-medium">{{ item.category }}</div>
                </td>
                <td class="p-4 text-right font-bold text-pink-600">
                  {{ item.price.toLocaleString() }}đ
                </td>
                <td class="p-4 text-center">
                  <span class="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-semibold"
                    >{{ item.stock_quantity }} cái</span
                  >
                </td>
                <td class="p-4 text-center whitespace-nowrap">
                  <button class="text-blue-500 hover:text-blue-700 mr-3 text-sm font-bold">
                    Sửa
                  </button>
                  <button class="text-red-500 hover:text-red-700 text-sm font-bold">Xóa</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Modal Thêm Sản Phẩm -->
      <div
        v-if="isProductModalOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        <div
          class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          @click="closeProductModal"
        ></div>
        <div
          class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl z-10 overflow-hidden animate-in fade-in zoom-in duration-300 border border-slate-100"
        >
          <div
            class="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50"
          >
            <h3 class="text-xl font-bold text-slate-800">🍱 Thêm món ăn mới</h3>
            <button @click="closeProductModal" class="text-slate-400 hover:text-slate-600 text-3xl">
              &times;
            </button>
          </div>

          <form @submit.prevent="submitProduct" class="p-8 space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="md:col-span-2">
                <label
                  class="block text-sm font-bold text-slate-700 mb-2 tracking-wide text-xs uppercase"
                  >Tên món ăn</label
                >
                <input
                  v-model="newProduct.name"
                  type="text"
                  required
                  class="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 focus:border-pink-500 focus:ring-0 outline-none transition-all placeholder:text-slate-300"
                  placeholder="VD: Gà Rán Cay..."
                />
              </div>

              <div>
                <label
                  class="block text-sm font-bold text-slate-700 mb-2 tracking-wide text-xs uppercase"
                  >Giá bán (VNĐ)</label
                >
                <input
                  v-model.number="newProduct.price"
                  type="number"
                  required
                  class="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 focus:border-pink-500 outline-none transition-all"
                  placeholder="25000"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-bold text-slate-700 mb-2 tracking-wide text-xs uppercase"
                  >Số lượng kho</label
                >
                <input
                  v-model.number="newProduct.stock_quantity"
                  type="number"
                  class="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 focus:border-pink-500 outline-none transition-all"
                  placeholder="50"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-bold text-slate-700 mb-2 tracking-wide text-xs uppercase"
                  >Danh mục</label
                >
                <select
                  v-model="newProduct.category"
                  class="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 focus:border-pink-500 outline-none transition-all cursor-pointer"
                >
                  <option value="Món chính">Món chính</option>
                  <option value="Đồ ăn nhanh">Đồ ăn nhanh</option>
                  <option value="Đồ uống">Đồ uống</option>
                </select>
              </div>

              <div>
                <label
                  class="block text-sm font-bold text-slate-700 mb-2 tracking-wide text-xs uppercase"
                  >Link hình ảnh</label
                >
                <input
                  v-model="newProduct.image_url"
                  type="text"
                  class="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 focus:border-pink-500 outline-none transition-all"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <label
                class="block text-sm font-bold text-slate-700 mb-2 tracking-wide text-xs uppercase"
                >Mô tả món ăn</label
              >
              <textarea
                v-model="newProduct.description"
                rows="3"
                class="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 focus:border-pink-500 outline-none transition-all resize-none"
                placeholder="Nhập mô tả chi tiết..."
              ></textarea>
            </div>

            <div class="pt-4 flex space-x-4">
              <button
                type="button"
                @click="closeProductModal"
                class="flex-1 px-6 py-3 border-2 border-slate-100 rounded-2xl text-slate-500 font-bold hover:bg-slate-50 transition-all"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                class="flex-1 px-6 py-3 bg-pink-500 text-white rounded-2xl font-bold hover:bg-pink-600 transition-all shadow-lg shadow-pink-100"
              >
                Lưu sản phẩm
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>
