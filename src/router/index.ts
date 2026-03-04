import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CheckOutView from '../views/CheckOutView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: CheckOutView,
      // Những trang cần đăng nhập mới được vào
      meta: { requiresAuth: true }, // Đánh dấu trang này cần xác thực
    },
    {
      path: '/admin',
      name: 'admin-dashboard',
      // Chua tao trang admin nên tạm thời để trống component, sau này sẽ tạo và import vào đây
      component: () => import('../views/AdminView.vue'), // Lazy load trang admin
      // Nhung trang phai la admin moi duoc vao
      meta: { requiresAuth: true, requiresAdmin: true }, // Cần xác thực và phải là admin
    },
    {
      path: '/admin/leads',
      name: 'admin-leads',
      component: () => import('../views/LeadManagementView.vue'), // Lazy load trang admin leads
      meta: { requiresAuth: true, requiresAdmin: true }, // Cần xác thực và phải là admin
    },
    {
      path: '/admin/products',
      name: 'admin-products',
      component: () => import('../views/ProductManagementView.vue'), // Lazy load trang admin products
      meta: { requiresAuth: true, requiresAdmin: true }, // Cần xác thực và phải là admin
    },
    {
      path: '/admin/orders',
      name: 'admin-orders',
      component: () => import('../views/OrderManagementView.vue'), // Lazy load trang admin orders
      meta: { requiresAuth: true, requiresAdmin: true }, // Cần xác thực và phải là admin
    }
  ],
})

router.beforeEach((to, from, next) => {
  // Lay token va role tu localStorage
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('role')

  // 1. Kiem tra cac trang can dang nhap
  if (to.meta.requiresAuth && !token) {
    // Neu chua dang nhap thi chuyen den trang login
    alert('Vui lòng đăng nhập để tiếp tục!')
    next({ name: 'login' })
  }
  // 2. Kiem tra cac trang can la admin
  else if (to.meta.requiresAdmin && userRole !== 'admin') {
    // Neu da dang nhap nhung khong phai admin thi chuyen ve trang home
    alert('Bạn không có quyền truy cập vào khu vực này!')
    return next({ name: 'home' })
  }
  else {
    // Neu khong can xac thuc hoac da dang nhap thi cho phep truy cap
    next()
  }
})

export default router
