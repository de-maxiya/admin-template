import { ref, computed } from 'vue'
import { defineStore } from 'pinia'



export const useBrandCrumbStore = defineStore('counter', () => {
    state: () => {
    return {
      // 所有这些属性都将自动推断出它们的类型
      count: 0,
      name: 'Eduardo',
      isAdmin: true,
      items: [],
      hasChanged: true,
    }
  },
  // const doubleCount = computed(() => count.value * 2)
   increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
