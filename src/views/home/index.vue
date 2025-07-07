<template>
  <div style="width: 2000px">
    home
    <!-- <button @click="goToShop">前往商品管理</button>
    <button @click="goToUser">查看用户</button> -->

    <div class="container">
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>1</div>
      <div>2</div>
      <div>3</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  display: grid;
  // grid-template-columns: 100px 100px 100px;
  // grid-template-rows: 100px 100px 100px;
  // 上面代码指定了一个三行三列的网格，列宽和行高都是100px

  // 这个是自动填充一行  每一项宽度为100px 自动填充满，超过换行
  // grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));

  // 第一列和第四列的宽度为100px，第二列和第五列为20px，第三列和第六列为80px。
  grid-template-columns: repeat(2, 100px 20px 80px); // 前面的数字是多少 就说明有几组
  gap: 10px;
  div {
    text-align: center;
    line-height: 100px;
    background-color: #f0f0f0;
    border: 1px solid #000;
  }
}
</style>

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
