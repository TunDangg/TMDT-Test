<script setup lang="ts">
import { Products } from '@/types'

defineProps<{
  product: Products
}>()

const emit = defineEmits<{
  (e: 'add-to-cart', product: Products): void
}>()
</script>

<template>
  <div
    class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-4 border border-gray-100 flex flex-col h-full group"
  >
    <div class="w-full h-40 overflow-hidden rounded-xl mb-3 bg-gray-100">
      <img
        :src="product.image_url || 'https://via.placeholder.com/300x200?text=No+Image'"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
    </div>
    <span
      class="text-[10px] font-bold uppercase tracking-wider bg-pink-50 text-red-700 px-2 py-1 rounded-md w-fit mb-3"
    >
      {{ product.category }}
    </span>

    <h3
      class="text-lg font-extrabold text-gray-800 mb-1 group-hover:text-red-700 transition-colors"
    >
      {{ product.name }}
    </h3>

    <p class="text-gray-400 text-xs mb-4 flex-grow line-clamp-2 italic">
      {{ product.description }}
    </p>

    <div class="flex justify-between items-end mt-auto">
      <div>
        <p class="text-[10px] text-gray-400 uppercase font-semibold">Giá bán</p>
        <p class="text-red-500 font-black text-xl">
          {{ Number(product.price).toLocaleString() }}<span class="text-sm ml-0.5">đ</span>
        </p>
      </div>

      <div class="text-right">
        <p class="text-[10px] text-gray-400 uppercase">Còn lại</p>
        <p class="text-sm font-bold text-gray-700">{{ product.stock_quantity }}</p>
      </div>
    </div>

    <button
      @click="$emit('add-to-cart', product)"
      class="w-full mt-4 bg-green-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-gray-200"
    >
      Thêm ngay
    </button>
  </div>
</template>
