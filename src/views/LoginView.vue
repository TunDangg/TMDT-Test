<template>
  <main class="min-h-screen flex w-full bg-white">
    <section class="relative hidden md:flex flex-1 items-center justify-center">
      <div class="absolute inset-0 z-0">
        <img
          alt="Gourmet Burger"
          class="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1500&auto=format&fit=crop"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20"></div>
      </div>

      <div class="relative z-10 w-full max-w-2xl px-12 lg:px-20">
        <div class="flex items-center gap-3 mb-6">
          <span class="text-orange-500 text-3xl italic font-black tracking-tighter"
            >EDTEXCO FastFood</span
          >
        </div>
        <h1
          class="text-white text-5xl lg:text-7xl font-extrabold leading-[1.15] tracking-tight mb-6"
        >
          Ngon Khó Cưỡng, <br />
          <span class="text-orange-500">Giao Tận Giường.</span>
        </h1>
        <p class="text-white/80 text-lg lg:text-xl font-medium max-w-lg mb-10 leading-relaxed">
          Trải nghiệm hương vị thức ăn nhanh tuyệt hảo với những ưu đãi độc quyền dành riêng cho
          bạn.
        </p>

        <div class="flex flex-wrap gap-4">
          <div
            class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-4"
          >
            <div class="bg-orange-500 rounded-full p-3 text-white shadow-lg shadow-orange-500/30">
              <Flame class="w-6 h-6" />
            </div>
            <div>
              <p class="text-white font-extrabold text-xl">100+</p>
              <p class="text-white/70 text-sm font-medium">Món Ngon</p>
            </div>
          </div>
          <div
            class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-4"
          >
            <div class="bg-orange-500 rounded-full p-3 text-white shadow-lg shadow-orange-500/30">
              <Star class="w-6 h-6" />
            </div>
            <div>
              <p class="text-white font-extrabold text-xl">4.9/5</p>
              <p class="text-white/70 text-sm font-medium">Đánh Giá</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      class="w-full md:w-[450px] lg:w-[550px] xl:w-[600px] shrink-0 flex items-center justify-center bg-white px-8 py-12 lg:px-16"
    >
      <div class="w-full max-w-md">
        <div class="md:hidden mb-10">
          <span class="text-orange-600 text-2xl italic font-black tracking-tighter"
            >EDTEXCO FastFood</span
          >
        </div>

        <header class="mb-10">
          <h2 class="text-3xl font-extrabold text-gray-900 mb-2">Chào mừng trở lại</h2>
          <p class="text-gray-500">Đăng nhập để bắt đầu đặt món ngay.</p>
        </header>

        <form class="space-y-5" @submit.prevent="handleLogin">
          <div class="space-y-1.5">
            <label class="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1"
              >Tên đăng nhập</label
            >
            <div class="relative">
              <User class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                v-model="username"
                type="text"
                required
                class="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all shadow-sm"
                placeholder="Nhập tên đăng nhập của bạn"
              />
            </div>
          </div>

          <div class="space-y-1.5">
            <div class="flex justify-between items-center ml-1">
              <label class="text-xs font-bold uppercase tracking-widest text-gray-500"
                >Mật khẩu</label
              >
              <a
                href="#"
                class="text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
                >Quên mật khẩu?</a
              >
            </div>
            <div class="relative">
              <Lock class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all shadow-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600 transition-colors"
              >
                <EyeOff v-if="showPassword" class="w-5 h-5" />
                <Eye v-else class="w-5 h-5" />
              </button>
            </div>
          </div>

          <div class="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="remember"
              class="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500/20 cursor-pointer"
            />
            <label
              for="remember"
              class="text-sm font-medium text-gray-500 cursor-pointer select-none"
              >Ghi nhớ đăng nhập</label
            >
          </div>

          <button
            type="submit"
            class="w-full py-4 mt-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-full shadow-lg shadow-orange-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
          >
            Đăng Nhập
            <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div class="mt-8">
          <div class="relative flex items-center justify-center mb-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <span
              class="relative px-4 bg-white text-xs font-bold uppercase tracking-widest text-gray-400"
              >Hoặc</span
            >
          </div>
          <div class="grid grid-cols-2 gap-4">
            <button
              class="flex items-center justify-center gap-2 py-3 px-4 bg-white rounded-2xl border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors font-medium"
            >
              <img
                alt="Google"
                class="w-5 h-5"
                src="https://www.svgrepo.com/show/475656/google-color.svg"
              />
              <span class="text-sm text-gray-700">Google</span>
            </button>
            <button
              class="flex items-center justify-center gap-2 py-3 px-4 bg-white rounded-2xl border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors font-medium"
            >
              <img
                alt="Facebook"
                class="w-5 h-5"
                src="https://www.svgrepo.com/show/475647/facebook-color.svg"
              />
              <span class="text-sm text-gray-700">Facebook</span>
            </button>
          </div>
        </div>

        <footer class="mt-8 text-center">
          <p class="text-gray-500 font-medium">
            Chưa có tài khoản?
            <router-link
              to="/register"
              class="text-orange-600 font-bold hover:underline underline-offset-4 ml-1"
              >Đăng ký ngay</router-link
            >
          </p>
        </footer>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '../services/api'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { User, Lock, Eye, EyeOff, ArrowRight, Flame, Star } from 'lucide-vue-next'

const username = ref('')
const password = ref('')
const showPassword = ref(false)

const router = useRouter()
const toast = useToast()

const handleLogin = async () => {
  try {
    const response = await api.post('/auth/login', {
      username: username.value,
      password: password.value,
    })
    localStorage.setItem('token', response.data.access_token)
    localStorage.setItem('role', response.data.user.role)
    localStorage.setItem('username', username.value)
    localStorage.setItem('userId', response.data.user.id)

    toast.success(`Chào mừng ${username.value} trở lại!`, { timeout: 2000 })
    router.push('/')
    setTimeout(() => window.location.reload(), 100)
  } catch (error) {
    toast.error('Sai tên đăng nhập hoặc mật khẩu!', { timeout: 3000 })
  }
}
</script>
