<template>
  <div>
    home
    <!-- <button @click="goToShop">前往商品管理</button>
    <button @click="goToUser">查看用户</button> -->
  </div>
</template>

<script setup lang="ts">
// import { useRouter } from 'vue-router'

// const router = useRouter()

const hello: string = 'hello'
console.log(hello, '==123')
// 跳转到商品管理页面
// const goToShop = () => {
//   // 方式1：使用路径
//   router.push('/shop')

//   // 方式2：使用命名路由（推荐）
//   // router.push({ name: 'shop' })
// }

// // 带参数的跳转示例
// const goToUser = () => {
//   // 命名路由+params参数（对应路径/user/123）
//   router.push({ name: 'user', params: { id: 123 } })

//   // 或者使用path+query参数（对应路径/user?id=123）
//   // router.push({ path: '/user', query: { id: 123 } })
// }
</script>
