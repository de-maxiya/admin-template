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

  // auto-fill会用空格子填满剩余宽度，auto-fit则会尽量扩大单元格的宽度
  // 这个是自动填充一行  每一项宽度为100px 自动填充满，超过换行
  grid-template-columns: repeat(
    auto-fill,
    minmax(33.33%, 1fr)
  ); //minmax(100px, 1fr)表示列宽不小于100px，不大于1fr
  grid-template-rows: repeat(auto-fill, minmax(33.33%, 1fr));

  // grid-template-rows: repeat(auto-fill, minmax(100px, 1fr));
  // place-items: center; /* 同时控制项目的水平和垂直对齐（相当于 align-items + justify-items） */

  // grid-template-columns: 150px 1fr 2fr; // 第一列的宽度为150像素，第二列的宽度是第三列的一半。
  // grid-template-rows: 150px 1fr 2fr;
  // 第一列和第四列的宽度为100px，第二列和第五列为20px，第三列和第六列为80px。
  // grid-template-columns: repeat(2, 100px 20px 80px); // 前面的数字是多少 就说明有几组
  gap: 10px;

  // 容器的子元素会按照顺序，自动放置在每一个网格。默认的放置顺序是"先行后列"，即先填满第一行，再开始放入第二行
  // 这个顺序由grid-auto-flow属性决定，默认值是row，即"先行后列"。也可以将它设成column，变成"先列后行"。
  // grid-auto-flow: column;
  // 设为row dense，表示"先行后列"，并且尽可能紧密填满，尽量不出现空格。
  // grid-auto-flow: row dense;
  // 如果将设置改为column dense，表示"先列后行"，并且尽量填满空格。
  //  grid-row-gap: 20px;
  // grid-column-gap: 20px;
  // row-gap  column-gap
  div {
    text-align: center;
    // line-height: 100px;
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
