<script setup lang="ts">
import { ref, onMounted } from 'vue'
// import { Document, Menu as IconMenu, Location, Setting } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import routes from '@/router/routes'
const isCollapse = ref(false)
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const menuItems = ref<any[]>([])
const route = useRoute()
const activeMenu = () => {
  return route.path
}
onMounted(() => {
  console.log(routes)
  menuItems.value = routes.filter((item) => !item.hidden) // 为true不是菜单栏目的数据
  console.log(menuItems)
})
</script>

<template>
  <div class="sidebar">
    <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
      <el-radio-button :value="false">expand</el-radio-button>
      <el-radio-button :value="true">collapse</el-radio-button>
    </el-radio-group> -->
    <el-menu
      active-text-color="#ffd04b"
      background-color="#212c3d"
      class="el-menu-vertical-demo"
      :default-active="activeMenu()"
      text-color="#fff"
      style="border: none"
      :collapse="isCollapse"
      router
      @open="handleOpen"
      @close="handleClose"
    >
      <!-- 动态渲染菜单项 -->
      <template v-for="item in menuItems" :key="item.path || item.index">
        <!-- 渲染一级菜单项 -->
        <el-menu-item v-if="item.type === 'item'" :index="item.path">
          <template #title>
            <el-icon v-if="item.icon && item.icon.startsWith('el-')" :style="{ color: 'white' }">
              <i :class="item.icon"></i>
            </el-icon>
            <el-icon v-else :style="{ color: 'white' }">
              <component :is="item.icon" />
            </el-icon>
            <span>{{ item.meta.title }}</span>
          </template>
        </el-menu-item>

        <!-- 渲染子菜单 -->
        <el-sub-menu v-else :index="item.path">
          <template #title>
            <el-icon :style="{ color: 'white' }">
              <i :class="item.icon"></i>
            </el-icon>
            <span>{{ item.meta.title }}</span>
          </template>

          <!-- 渲染子菜单项 -->
          <el-menu-item
            v-for="child in item.children"
            :key="child.path"
            :index="item.path + '/' + child.path"
          >
            <el-icon :style="{ color: 'white' }">
              <i :class="item.icon"></i>
            </el-icon>
            <span> {{ child.meta.title }}</span>
          </el-menu-item>
        </el-sub-menu>
      </template>
    </el-menu>
  </div>
</template>

<style scoped>
.sidebar {
  width: 240px;
  height: 100vh;
  max-height: 100vh;
  /* overflow: scroll; */
  background-color: #334156;
}
.sidebar-menu {
  background-color: #212d3d;
  color: white;
}
</style>
