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
  <div class="all" style="display: flex">
    <sidebar @change="handleChange" />

    <div
      :style="{
        position: 'relative',
        width: `calc(100% - ${isCollapse ? '80px' : '240px'})`,
        marginLeft: isCollapse ? '80px' : '240px',
        transition: 'all 0.1s',
      }"
    >
      <navbar :isCollapse="isCollapse" />

      <div class="routerView">
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
.routerView {
  padding: 20px;
  background-color: white;
  margin: 20px;
  margin-top: 6vh;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 2vh;
  height: 92vh;
  overflow-y: auto;
}
.all {
  width: 100%;
  height: 100vh;
  background-color: #f5f5f5;
  /* overflow: scroll; */
}
</style>
