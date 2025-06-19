<script setup lang="ts">
import { ref } from 'vue'
// import { Document, Menu as IconMenu, Location, Setting } from '@element-plus/icons-vue'

const isCollapse = ref(false)
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
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
      :default-active="activeMenu"
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
