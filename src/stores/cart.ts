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
        } else {
          console.error('Lỗi khi lấy giỏ hàng:', response.statusText)
          this.items = []
        }
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
        const response = await fetch('http://localhost:3000/cart/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id, quantity }),
        })

        const result = await response.json()
        if (response.ok) {
          await this.fetchCart() // Cập nhật lại state sau khi lưu DB thành công
          return { success: true, message: result.message || 'Thêm vào giỏ hàng thành công!' }
        }
        return { success: false, message: result.message || 'Lỗi hệ thống' }
      } catch (error) {
        console.error('Lỗi khi thêm vào giỏ:', error)
        return { success: false, message: 'Không thể kết nối đến máy chủ' }
      }
    },

    // 3. Xóa sản phẩm khỏi giỏ hàng trên Database
    async deleteItem(productId: number) {
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
        await fetch('http://localhost:3000/cart', { method: 'DELETE' })
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
          const response = await fetch(`http://localhost:3000/products/${item.id}`)

          if (!response.ok) {
            invalidItems.push({
              product: item,
              reason: 'Sản phẩm không còn tồn tại',
            })
            continue
          }

          const productData = await response.json()

          // Kiểm tra tồn kho
          if (productData.stock_quantity === 0) {
            invalidItems.push({
              product: item,
              reason: 'Sản phẩm đã hết hàng',
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
