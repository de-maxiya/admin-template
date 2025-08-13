<script setup>
import { ref, onMounted, defineEmits } from 'vue'
// import { Document, Menu as IconMenu, Location, Setting } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import routes from '@/router/routes'
const isCollapse = ref(false)
const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}

const menuItems = ref([])
const route = useRoute()
const activeMenu = () => {
  return route.path
}
onMounted(() => {
  menuItems.value = routes.filter((item) => !item.hidden) // 为true不是菜单栏目的数据
})
const handleClick = (key) => {
  console.log(key, route)
}
import img from '@/assets/themify-favicon.png'
// const props = defineProps({
//   isCollapse: {
//     type: Boolean,
//     default: false,
//   },
// })
const emit = defineEmits(['sendData', 'updateCount'])
const handleCloseOpen = () => {
  isCollapse.value = !isCollapse.value
  emit('change', isCollapse.value)
}
</script>

<template>
  <div class="sidebar" :style="{ width: isCollapse ? '60px' : '220px' }">
    <div
      :style="{
        display: 'flex',
        // 折叠时改为居中对齐，非折叠时保持两端对齐
        justifyContent: isCollapse ? 'center' : 'space-between',
        alignItems: 'center',
        padding: '5px',
        backgroundColor: '#fcfcfc',
        textAlign: 'center',
      }"
    >
      <div v-if="!isCollapse" style="display: flex; align-items: center; gap: 8px">
        <el-image :src="img" style="width: 35px; height: 35px"></el-image>
        <span>LSJ</span>
      </div>
      <div>
        <el-icon
          style="height: 35px; margin: auto"
          :size="20"
          color="#579cfe"
          @click="handleCloseOpen"
        >
          <Fold />
        </el-icon>
      </div>
    </div>
    <el-menu
      active-text-color="#579cfe"
      background-color="white"
      class="el-menu-vertical-demo"
      :default-active="activeMenu()"
      text-color="black"
      style="border: none"
      :collapse="isCollapse"
      router
      @open="handleOpen"
      @close="handleClose"
      @click="handleClick"
    >
      <!-- 动态渲染菜单项 -->
      <template v-for="item in menuItems" :key="item.path || item.index">
        <!-- 渲染一级菜单项 -->
        <el-menu-item v-if="item.type === 'item'" :index="item.path">
          <template #title>
            <el-icon>
              <component :is="item.meta.icon" />
            </el-icon>
            <span>{{ item.meta.title }}</span>
          </template>
        </el-menu-item>

        <!-- 渲染子菜单 -->
        <el-sub-menu v-else :index="item.path">
          <template #title>
            <el-icon>
              <component :is="item.meta.icon" />
            </el-icon>
            <span>{{ item.meta.title }}</span>
          </template>

          <!-- 渲染子菜单项 -->
          <el-menu-item
            v-for="child in item.children"
            :key="child.path"
            :index="item.path + '/' + child.path"
          >
            <el-icon>
              <component :is="child.meta.icon" />
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
  position: fixed;
  left: 0;
  top: 0;
  height: 96vh;
  margin: 2vh 0px 2vh 20px;
  max-height: 96vh;
  border-radius: 20px;
  overflow: hidden;
  /* overflow: scroll; */
  background-color: white;
}
.sidebar-menu {
  background-color: white;
  color: white;
}
</style>
