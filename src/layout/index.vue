<script setup>
import sidebar from './components/Sidebar/index.vue'
import navbar from './components/Navbar.vue'
import { ref } from 'vue'
const isCollapse = ref(false)
const handleChange = (val) => {
  console.log(val, '==132')
  isCollapse.value = val
}
</script>

<template>
  <div class="all" style="display: flex">
    <sidebar @change="handleChange" />

    <!-- 需要使用relative ，会自动占据剩下的宽度 ，如果使用absolute ，则不会自动占据剩下的宽度，还需要手动 减去左侧菜单栏的240像素 -->
    <div
      :style="{
        position: 'relative',
        width: `calc(100% - ${isCollapse ? '80px' : '240px'})`,
        marginLeft: isCollapse ? '80px' : '240px',
        transition: 'all 0.3s',
      }"
    >
      <navbar />

      <div
        style="
          padding: 20px;
          background-color: white;
          margin: 20px;
          border-radius: 10px;
          overflow: hidden;
        "
      >
        <!-- 给每一个页面新增 20pd间距，防止贴边展示 -->
        <router-view />
      </div>
    </div>

    <!-- <img
      src="https://picsum.photos/200/200"
      alt="用户头像"
      class="w-8 h-8 rounded-full object-cover"
      style="width: 200px; height: 200px"
    /> -->
  </div>
</template>
<!-- https://sxcontent9668.azureedge.us/cms-assets/assets/Mars_Rotation_Web_HB_d96299f9de.mp4 -->
<style scoped>
.all {
  width: 100%;
  height: 100vh;
  background-color: #f5f5f5;
}
</style>
