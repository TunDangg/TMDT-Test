<template>
  <div
    class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md border-t-4 border-orange-500"
  >
    <h2 class="text-2xl font-bold mb-6 text-center text-orange-600">Đăng Ký Tài Khoản</h2>
    <form @submit.prevent="handleRegister">
      <div class="mb-4">
        <label class="block text-gray-700 mb-2">Tên đăng nhập</label>
        <input
          v-model="username"
          type="text"
          class="w-full px-4 py-2 border rounded-lg outline-none"
          required
        />
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 mb-2">Mật khẩu</label>
        <input
          v-model="password"
          type="password"
          class="w-full px-4 py-2 border rounded-lg outline-none"
          required
        />
      </div>
      <button
        type="submit"
        class="w-full bg-orange-500 text-white py-2 rounded-lg font-bold hover:bg-orange-600 transition"
      >
        Đăng Ký
      </button>
    </form>
    <p class="mt-4 text-center text-sm">
      Bạn đã có tài khoản?
      <router-link to="/login" class="text-orange-600 font-bold">Đăng nhập</router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '../services/api'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const username = ref('')
const password = ref('')
const router = useRouter()
const toast = useToast()

const handleRegister = async () => {
  try {
    // Đăng ký tài khoản
    await api.post('/auth/register', {
      username: username.value,
      password: password.value
    })

    // Tự động đăng nhập sau khi đăng ký thành công
    try {
      const loginResponse = await api.post('/auth/login', {
        username: username.value,
        password: password.value,
      })
      localStorage.setItem('token', loginResponse.data.access_token)
      localStorage.setItem('username', username.value)
      toast.success('Đăng ký và đăng nhập thành công!', { timeout: 2000 })
      router.push('/')
      setTimeout(() => window.location.reload(), 100)
    } catch (loginError) {
      toast.info('Đăng ký thành công! Vui lòng đăng nhập.', { timeout: 2000 })
      router.push('/login')
    }
  } catch (err) {
    console.error('Register error:', err)
    toast.error('Tên người dùng đã tồn tại!', { timeout: 3000 })
  }
}
</script>
