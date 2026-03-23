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
          <span class="text-red-500 text-3xl italic font-black tracking-tighter"
            >EDTEXCO FastFood</span
          >
        </div>
        <h1
          class="text-white text-5xl lg:text-7xl font-extrabold leading-[1.15] tracking-tight mb-6"
        >
          Gia Nhập <br />
          <span class="text-red-500">Hội Ghiền Ăn.</span>
        </h1>
        <p class="text-white/80 text-lg lg:text-xl font-medium max-w-lg mb-10 leading-relaxed">
          Tạo tài khoản ngay hôm nay để nhận những ưu đãi và mã giảm giá độc quyền cho đơn hàng đầu
          tiên của bạn.
        </p>

        <div class="flex flex-wrap gap-4">
          <div
            class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-4"
          >
            <div class="bg-red-500 rounded-full p-3 text-white shadow-lg shadow-red-500/30">
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
            <div class="bg-red-500 rounded-full p-3 text-white shadow-lg shadow-red-500/30">
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
          <span class="text-red-600 text-2xl italic font-black tracking-tighter"
            >EDTEXCO FastFood</span
          >
        </div>

        <header class="mb-10">
          <h2 class="text-3xl font-extrabold text-gray-900 mb-2">Đăng Ký Tài Khoản</h2>
          <p class="text-gray-500">Trở thành thành viên và mở khóa ưu đãi.</p>
        </header>

        <form class="space-y-4" @submit.prevent="handleRegister">
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
                class="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all shadow-sm"
                placeholder="Tên đăng nhập của bạn"
              />
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1"
              >Mật khẩu</label
            >
            <div class="relative">
              <Lock class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all shadow-sm"
                placeholder="Nhập mật khẩu của bạn"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <EyeOff v-if="showPassword" class="w-5 h-5" />
                <Eye v-else class="w-5 h-5" />
              </button>
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1"
              >Xác nhận Mật khẩu</label
            >
            <div class="relative">
              <ShieldCheck class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                class="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all shadow-sm"
                placeholder="Nhập lại mật khẩu"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <EyeOff v-if="showConfirmPassword" class="w-5 h-5" />
                <Eye v-else class="w-5 h-5" />
              </button>
            </div>
            <p v-if="passwordError" class="text-xs text-red-500 font-medium ml-1 mt-1">
              {{ passwordError }}
            </p>
          </div>

          <div class="flex items-start gap-3 py-2">
            <input
              type="checkbox"
              id="terms"
              required
              class="mt-1 w-5 h-5 rounded border-gray-300 text-red-500 focus:ring-red-500/20 cursor-pointer"
            />
            <label
              for="terms"
              class="text-xs font-medium text-gray-500 leading-relaxed cursor-pointer select-none"
            >
              Tôi đồng ý với
              <a href="#" class="text-red-500 font-bold hover:underline">Điều khoản</a> và
              <a href="#" class="text-red-500 font-bold hover:underline">Bảo mật</a>.
            </label>
          </div>

          <button
            type="submit"
            class="w-full py-4 mt-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full shadow-lg shadow-red-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
          >
            Đăng Ký
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
            Bạn đã có tài khoản?
            <router-link
              to="/login"
              class="text-red-500 font-bold hover:underline underline-offset-4 ml-1"
              >Đăng nhập</router-link
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
import { User, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Flame, Star } from 'lucide-vue-next'

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const passwordError = ref('')

const router = useRouter()
const toast = useToast()

const handleRegister = async () => {
  passwordError.value = ''
  if (password.value !== confirmPassword.value) {
    passwordError.value = 'Mật khẩu xác nhận không khớp!'
    return
  }
  if (password.value.length < 6) {
    passwordError.value = 'Mật khẩu phải có ít nhất 6 ký tự.'
    return
  }

  try {
    await api.post('/auth/register', {
      username: username.value,
      password: password.value,
    })

    try {
      const loginResponse = await api.post('/auth/login', {
        username: username.value,
        password: password.value,
      })
      localStorage.setItem('token', loginResponse.data.access_token)
      localStorage.setItem('username', username.value)
      if (loginResponse.data.user?.id) {
        localStorage.setItem('userId', loginResponse.data.user.id)
      }

      toast.success('Đăng ký thành công! 🎉', { timeout: 2000 })
      router.push('/')
      setTimeout(() => window.location.reload(), 100)
    } catch {
      toast.info('Đăng ký thành công! Vui lòng đăng nhập.', { timeout: 2000 })
      router.push('/login')
    }
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Tên người dùng đã tồn tại!'
    toast.error(errorMessage, { timeout: 3000 })
  }
}
</script>
