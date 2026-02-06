import { defineStore } from 'pinia'
import { Products } from '@/types'
import { CartItem } from '@/types'

const CART_STORAGE_KEY = 'shopping-cart'

// Lưu dữ liệu vào localStorage
const loadCartFromStorage = (): Products[] => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    return savedCart ? JSON.parse(savedCart) : []
  } catch (error) {
    console.error('Lỗi kết nối localstorage', error)
    return []
  }
}

const saveCartToStorage = (items: Products[]) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    console.error('Lỗi kết nối localstorage', error)
  }
}

export const useCartStore = defineStore('cart', {

  state: () => ({
    items: loadCartFromStorage() as Products[],
  }),
  getters: {
    totalPrice: (state) => {
      return state.items.reduce((total, item) => {
        return total + item.price * item.quantity
      }, 0)
    },
    totalItems: (state) => {
      return state.items.reduce((total, item) => {
        return total + item.quantity
      }, 0)
    },
  },
  actions: {
    addToCart(product) {
      const existingItem = this.items.find((item) => item.id === product.id)

      if (existingItem) {
        // Kiểm tra nếu số lượng trong giỏ đã đạt tối đa so với kho
        if (existingItem.quantity >= product.stock_quantity) {
          return { success: false, message: product.name + ' chỉ còn lại ' + product.stock_quantity + ' sản phẩm!' }
        }
        existingItem.quantity++
      } else {
        // Kiểm tra nếu sản phẩm hết hàng
        if (product.stock_quantity <= 0) {
          return { success: false, message: product.name + ' đã hết hàng!' }
        }
        this.items.push({ ...product, quantity: 1 })
      }

      saveCartToStorage(this.items)
      return { success: true, message: 'Thêm vào giỏ hàng thành công!' }
    },
    removeFromCart(productId) {
      const item = this.items.find((i) => i.id === productId)
      if (item && item.quantity > 1) {
        item.quantity--
      } else {
        this.deleteItem(productId)
      }
      saveCartToStorage(this.items)
    },

    deleteItem(productId) {
      this.items = this.items.filter((i) => i.id !== productId)
      saveCartToStorage(this.items)
    },

    clearCart() {
      this.items = []
      saveCartToStorage(this.items)
    },
  },
})
