<script setup lang="ts">
import sidebar from './components/Sidebar/index.vue'
import navbar from './components/Navbar.vue'
</script>

<template>
  <div class="all" style="display: flex">
    <sidebar />

    <!-- 需要使用relative ，会自动占据剩下的宽度 ，如果使用absolute ，则不会自动占据剩下的宽度，还需要手动 减去左侧菜单栏的240像素 -->
    <div style="position: relative; width: 100%">
      <navbar />

      <div style="padding: 20px">
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

<style scoped>
.all {
  width: 100%;
  height: 100%;
}
</style>
