<script setup>
defineProps(['product'])
defineEmits(['add-to-cart'])

const cardStyle = {
  border: '1px solid #ddd',
  padding: '15px',
  borderRadius: '8px',
  background: 'white',
}

const buttonStyle = {
  id : 'button',
  style: {
    background: '#42b883',
    color: 'white',
    border: 'none',
    padding : '5px 10px',
    cursor: 'pointer',
    borderRadius: '8px',
  }
}

</script>

<template>
  <div :style = "cardStyle">
    <h3>{{ product.name }}</h3>
    <p>Giá: {{ product.price.toLocaleString() }}đ</p>
    <button 
      :style = "buttonStyle.style"
      @click="$emit('add-to-cart', product)"
    >
      Thêm vào giỏ
    </button>
  </div>
</template>