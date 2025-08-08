<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useLoginStore } from '@/stores/login'
const loginForm = ref({
  account: 'admin',
  password: '123456',
})

const loginStore = useLoginStore()

const router = useRouter()
const handleLogin = () => {
  if (!loginForm.value.account) {
    ElMessage.error('请输入账号')
    return
  }
  if (!loginForm.value.password) {
    ElMessage.error('请输入密码')
    return
  }
  if (loginForm.value.account === 'admin' && loginForm.value.password === '123456') {
    ElMessage.success('登录成功')
    loginStore.increment(true)
    router.push({ name: 'home' })
  } else {
    ElMessage.error('账号或密码错误')
  }
}
</script>

<template>
  <div class="loginbgc-container">
    <div class="loginbgc">
      <div class="login">
        <el-form
          ref="form"
          :model="loginForm"
          label-width="80px"
          label-position="top"
          style="padding: 20px"
        >
          <el-form-item label="账号">
            <template #label>
              <span style="color: #000">账号</span>
            </template>
            <el-input v-model="loginForm.account" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <template #label>
              <span style="color: #000">密码</span>
            </template>
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
        </el-form>

        <div class="btnFootr">
          <el-button type="primary" @click="handleLogin">登录</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* 核心：禁用整个页面的滚动并隐藏滚动条 */
body {
  overflow: hidden; /* 禁用页面滚动 */
  margin: 0; /* 清除默认边距 */
}
// https://sxcontent9668.azureedge.us/cms-assets/assets/Mars_Rotation_Web_HB_d96299f9de.mp4

.loginbgc-container {
  width: 100vw;
  height: 100vh;
  /* 移除滚动相关设置 */
  overflow: hidden;
  scroll-snap-type: none;
  // blob:https://cn.bing.com/c03f5afe-5fa9-43f7-a638-bbbaf44957ae
  .loginbgc {
    width: 100%;
    height: 100%;
    background:
      linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),
      url('https://ecreps.bellacocool.com/d7527c28-8238-4207-8161-42aa5062ebbd.webp') center/cover
        no-repeat fixed;

    animation: breathe 15s ease-in-out infinite;
    position: relative;
    .login {
      width: 500px;
      height: 300px;
      background-color: rgb(110, 122, 110, 0.1);
      // opacity: 0.2;
      border-radius: 20px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
.btnFootr {
  // width: 60px;
  // margin: 0 auto;
  display: flex;
  justify-content: center;
}

@keyframes breathe {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

/* 额外：确保移动端也禁用滚动 */
@media (pointer: coarse) {
  body {
    touch-action: none; /* 禁用触摸滚动 */
  }
}
</style>
