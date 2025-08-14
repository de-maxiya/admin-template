<script setup>
import sidebar from './components/Sidebar/index.vue'
import navbar from './components/Navbar.vue'
import { ref } from 'vue'
const isCollapse = ref(false)
const handleChange = (val) => {
  isCollapse.value = val
}
</script>

<template>
  <!-- 整体大布局 -->
  <div class="all">
    <!-- 侧边栏 -->
    <sidebar @change="handleChange" />
    <!-- 内容区域 -->
    <div
      :style="{
        position: 'relative',
        width: `calc(100% - ${isCollapse ? '80px' : '240px'})`,
        marginLeft: isCollapse ? '80px' : '240px',
        transition: 'all 0.1s',
      }"
    >
      <!-- 导航栏 -->
      <navbar :isCollapse="isCollapse" />

      <!-- 路由出口 -->
      <div class="routerView">
        <div class="routerViewContent">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.routerView {
  padding: 0px 20px;
  margin-top: 6vh;
  margin-bottom: 2vh;
  height: 92vh;
  .routerViewContent {
    border-radius: 10px;
    height: auto;
    padding: 20px;
    max-height: 100%;
    overflow: hidden;
    background-color: white;
    overflow-y: auto;
  }
}
.all {
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: #f5f5f5;
}
</style>
