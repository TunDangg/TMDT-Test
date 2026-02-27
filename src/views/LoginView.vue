<template>
  <div
    class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md border-t-4 border-orange-500"
  >
    <h2 class="text-2xl font-bold mb-6 text-center text-orange-600">Đăng Nhập</h2>
    <form @submit.prevent="handleLogin">
      <div class="mb-4">
        <label class="block text-gray-700 mb-2">Tên đăng nhập</label>
        <input
          v-model="username"
          type="text"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-300 outline-none"
          required
        />
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 mb-2">Mật khẩu</label>
        <input
          v-model="password"
          type="password"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-300 outline-none"
          required
        />
      </div>
      <button
        type="submit"
        class="w-full bg-orange-500 text-white py-2 rounded-lg font-bold hover:bg-orange-600 transition"
      >
        Đăng Nhập
      </button>
    </form>
    <p class="mt-4 text-center text-sm">
      Chưa có tài khoản?
      <router-link to="/register" class="text-orange-600 font-bold">Đăng ký ngay</router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '../services/api'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const router = useRouter()

const handleLogin = async () => {
  try {
    const response = await api.post('/auth/login', {
      username: username.value,
      password: password.value,
    })
    localStorage.setItem('token', response.data.access_token) // Lưu JWT vào localStorage
    localStorage.setItem('user', JSON.stringify({ username: username.value }))
    alert('Đăng nhập thành công!')
    router.push('/')
  } catch (error) {
    alert('Sai tài khoản hoặc mật khẩu!')
  }
}
</script>
