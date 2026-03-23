import { defineStore } from 'pinia'
import { Products } from '@/types'
import api from '@/services/api'

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
    clearLocalCart() {
      this.items = []
    },
    // 1. Lấy giỏ hàng từ Database khi tải trang hoặc đăng nhập
    async fetchCart() {
      this.isLoading = true
      try {
        const userId = localStorage.getItem('userId')
        if (!userId) {
          // Chưa đăng nhập, giỏ hàng rỗng
          this.items = []
          return
        }

        const response = await api.get(`/cart?userId=${userId}`)
        this.items = response.data
      } catch (error) {
        console.error('Lỗi khi lấy giỏ hàng từ server:', error)
        this.items = []
      } finally {
        this.isLoading = false
      }
    },

    // 2. Thêm vào giỏ hàng (Lưu trực tiếp vào MySQL)
    async addToCart(product: Products, quantity = 1) {
      try {
        const userId = localStorage.getItem('userId')
        if (!userId) {
          return { success: false, message: 'Vui lòng đăng nhập để thêm vào giỏ hàng' }
        }

        await api.post(`/cart/add`, {
          userId: Number(userId),
          productId: product.id,
          quantity,
        })

        await this.fetchCart() // Cập nhật lại state sau khi lưu DB thành công
        // Always use product name from parameter to ensure it's shown
        return { success: true, message: `Thêm ${product.name} vào giỏ hàng thành công!` }
      } catch (error: any) {
        const message = error.response?.data?.message || 'Không thể kết nối đến máy chủ'
        return { success: false, message }
      }
    },

    // 3. Xóa sản phẩm khỏi giỏ hàng trên Database
    async deleteItem(productId: number) {
      try {
        const userId = localStorage.getItem('userId')
        if (!userId) return

        await api.delete(`/cart/${productId}?userId=${userId}`)
        await this.fetchCart()
      } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error)
      }
    },

    // 3.5. Giảm số lượng sản phẩm trong giỏ hàng
    async removeFromCart(productId: number) {
      const item = this.items.find((i) => i.id === productId)
      if (!item) return

      if (item.quantity > 1) {
        // Nếu số lượng > 1, giảm đi 1
        await this.addToCart(item, -1)
      } else {
        // Nếu số lượng = 1, xóa luôn
        await this.deleteItem(productId)
      }
    },

    // 4. Xóa sạch giỏ hàng (ví dụ sau khi thanh toán xong)
    async clearCart() {
      try {
        const userId = localStorage.getItem('userId')
        if (!userId) return

        await api.delete(`/cart?userId=${userId}`)
        this.items = []
      } catch (error) {
        console.error('Lỗi khi làm trống giỏ hàng:', error)
      }
    },

    // 5. Validate giỏ hàng trước khi thanh toán (kiểm tra tồn kho)
    async validateCartItems() {
      const invalidItems: Array<{ product: Products; reason: string }> = []

      // Kiểm tra từng sản phẩm trong giỏ hàng
      for (const item of this.items) {
        try {
          // Gọi API để lấy thông tin sản phẩm mới nhất từ server
          const response = await api.get(`/products/${item.id}`)
          const productData = response.data

          // Kiểm tra tồn kho
          if (productData.stock_quantity === 0) {
            invalidItems.push({
              product: item,
              reason: `${productData.name} đã hết hàng`,
            })
          } else if (productData.stock_quantity < item.quantity) {
            invalidItems.push({
              product: item,
              reason: `Chỉ còn ${productData.stock_quantity} sản phẩm ${productData.name} trong kho`,
            })
          }
        } catch (error) {
          console.error('Lỗi khi validate sản phẩm:', error)
          invalidItems.push({
            product: item,
            reason: 'Không thể kiểm tra sản phẩm',
          })
        }
      }

      return invalidItems
    },
  },
})
