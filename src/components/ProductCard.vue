<script setup>
defineProps(['product'])
defineEmits(['add-to-cart'])
</script>

<template>
  <div
    class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-5 border border-gray-100"
  >
    <h3 class="text-lg font-bold text-gray-800 mb-2">{{ product.name }}</h3>
    <p class="text-orange-600 font-semibold mb-4">Giá: {{ product.price.toLocaleString() }}đ</p>
    <button
      @click="$emit('add-to-cart', product)"
      class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg transition shadow-lg active:scale-95"
    >
      Thêm vào giỏ
    </button>
  </div>
</template>
