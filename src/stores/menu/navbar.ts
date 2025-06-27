// import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useBrandCrumbStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  getters: {},
  actions: {
    increment(val: number) {
      this.count = val
    },
  },
})
