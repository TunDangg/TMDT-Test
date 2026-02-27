import { defineStore } from 'pinia'
import { Products } from '@/types'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as Products[],
    isLoading: false,
  }),
  getters: {
    totalPrice: (state) =>
      state.items.reduce((total, item) => total + item.price * item.quantity, 0),
    totalItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
  },
  actions: {
    // 1. Lấy giỏ hàng từ Database khi tải trang hoặc đăng nhập
    async fetchCart() {
      this.isLoading = true
      try {
        const response = await fetch('http://localhost:3000/cart')
        if (response.ok) {
          this.items = await response.json()
        }
      } catch (error) {
        console.error('Lỗi khi lấy giỏ hàng từ server:', error)
      } finally {
        this.isLoading = false
      }
    },

    // 2. Thêm vào giỏ hàng (Lưu trực tiếp vào MySQL)
    async addToCart(product: any) {
      try {
        const response = await fetch('http://localhost:3000/cart/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id, quantity: 1 }),
        })

        const result = await response.json()
        if (response.ok) {
          await this.fetchCart() // Cập nhật lại state sau khi lưu DB thành công
          return { success: true, message: 'Thêm vào giỏ hàng thành công!' }
        }
        return { success: false, message: result.message || 'Lỗi hệ thống' }
      } catch (error) {
        return { success: false, message: 'Không thể kết nối đến máy chủ' }
      }
    },

    // 3. Xóa sản phẩm khỏi giỏ hàng trên Database
    async deleteItem(productId: any) {
      try {
        const response = await fetch(`http://localhost:3000/cart/${productId}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          await this.fetchCart()
        }
      } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error)
      }
    },

    // 4. Xóa sạch giỏ hàng (ví dụ sau khi thanh toán xong)
    async clearCart() {
      try {
        await fetch('http://localhost:3000/cart', { method: 'DELETE' })
        this.items = []
      } catch (error) {
        console.error('Lỗi khi làm trống giỏ hàng:', error)
      }
    },
  },
})
