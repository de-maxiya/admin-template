<script setup lang="ts">
import sidebar from './components/Sidebar/index.vue'
import navbar from './components/Navbar.vue'
</script>

<template>
  <div class="all" style="display: flex">
    <sidebar />

    <navbar />
    <div style="position: absolute; margin-left: 240px; margin-top: 60px">
      <router-view />
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
