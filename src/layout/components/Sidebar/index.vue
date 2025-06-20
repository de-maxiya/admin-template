<script setup lang="ts">
import { ref, onMounted } from 'vue'
// import { Document, Menu as IconMenu, Location, Setting } from '@element-plus/icons-vue'

const isCollapse = ref(false)
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const menuItems = ref<any[]>([])
import routes from '@/router/routes'
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
      :default-active="'/'"
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
            <span>{{ item.name }}</span>
          </template>
        </el-menu-item>

        <!-- 渲染子菜单 -->
        <el-sub-menu v-else :index="item.index">
          <template #title>
            <el-icon :style="{ color: 'white' }">
              <i :class="item.icon"></i>
            </el-icon>
            <span>{{ item.name }}</span>
          </template>

          <!-- 渲染子菜单项 -->
          <el-menu-item v-for="child in item.children" :key="child.path" :index="child.path">
            {{ child.name }}
          </el-menu-item>
        </el-sub-menu>
      </template>
    </el-menu>
    <el-menu
      active-text-color="#ffd04b"
      background-color="#212c3d"
      class="el-menu-vertical-demo"
      :default-active="'/'"
      text-color="#fff"
      style="border: none"
      :collapse="isCollapse"
      router
      @open="handleOpen"
      @close="handleClose"
    >
      <!-- 第一层：系统概览 -->
      <el-menu-item index="/">
        <template #title>
          <el-icon style="color: white"><House /></el-icon>
          <span>系统概览</span>
        </template>
      </el-menu-item>

      <!-- 第二层：数据管理模块 -->
      <el-sub-menu index="data">
        <template #title>
          <i class="el-icon-s-data"></i>
          <span>数据管理</span>
        </template>
        <el-menu-item index="/data/list">数据列表</el-menu-item>
        <el-menu-item index="/data/import">数据导入</el-menu-item>
        <el-menu-item index="/data/export">数据导出</el-menu-item>
      </el-sub-menu>

      <!-- 第二层：用户管理模块 -->
      <el-sub-menu index="user">
        <template #title>
          <i class="el-icon-s-custom"></i>
          <span>用户管理</span>
        </template>
        <el-menu-item index="/user/list">用户列表</el-menu-item>
        <el-menu-item index="/user/role">角色管理</el-menu-item>
        <el-menu-item index="/user/permission">权限配置</el-menu-item>
      </el-sub-menu>

      <!-- 第二层：系统设置模块 -->
      <el-sub-menu index="system">
        <template #title>
          <i class="el-icon-s-tools"></i>
          <span>系统设置</span>
        </template>
        <el-menu-item index="/system/settings">基本设置</el-menu-item>
        <el-menu-item index="/system/logs">操作日志</el-menu-item>
        <el-menu-item index="/system/backup">数据备份</el-menu-item>
      </el-sub-menu>
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
