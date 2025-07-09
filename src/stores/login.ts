// import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useLoginStore = defineStore('counter', {
  state: () => ({
    count: false,
  }),
  getters: {},
  actions: {
    increment(val: boolean) {
      this.count = val
    },
    close() {
      this.count = false
    },
  },
})
