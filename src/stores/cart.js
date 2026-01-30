import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
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
        existingItem.quantity++
      } else {
        this.items.push({ ...product, quantity: 1 })
      }
    },
    removeFromCart(productId) {
      const item = this.items.find((i) => i.id === productId)
      if (item && item.quantity > 1) {
        item.quantity--
      } else {
        this.deleteItem(productId)
      }
    },

    deleteItem(productId) {
      this.items = this.items.filter((i) => i.id !== productId)
    },
  },
})
