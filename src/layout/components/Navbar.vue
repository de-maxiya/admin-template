<script setup lang="ts"></script>

<template>
  <div class="navbar">
    <div class="leftTit">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item>
        <el-breadcrumb-item>
          <a href="/">promotion management</a>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="rightTit">
      <!-- https://e-assets.gitee.com/gitee-community-web/_next/static/media/mjc.a8f527c7.png?x-bce-process=image -->
      <!-- https://picsum.photos/50/50 -->
      <img
        src="https://picsum.photos/50/50"
        alt="用户头像"
        class="w-8 h-8 rounded-full object-cover"
        style="width: 50px; height: 50px"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.navbar {
  height: 50px;
  width: 100%;
  box-shadow: 0 2px 4px #f3f4f5;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  .rightTit {
    // border-radius: 25px;
    // overflow: hidden;
  }
}
</style>
