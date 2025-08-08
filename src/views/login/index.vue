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
const isLoading = ref(false) // 登录加载状态

const handleLogin = async () => {
  if (!loginForm.value.account) {
    ElMessage.error('请输入账号')
    return
  }
  if (!loginForm.value.password) {
    ElMessage.error('请输入密码')
    return
  }

  isLoading.value = true
  try {
    // 模拟登录请求延迟
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (loginForm.value.account === 'admin' && loginForm.value.password === '123456') {
      ElMessage.success('登录成功，正在进入系统...')
      loginStore.increment(true)
      // 延迟跳转，让用户看到成功提示
      setTimeout(() => {
        router.push({ name: 'home' })
      }, 1000)
    } else {
      ElMessage.error('账号或密码错误，请重试')
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="loginbgc-container">
    <div class="loginbgc">
      <!-- 视频背景元素 -->
      <video
        class="bg-video"
        autoplay
        muted
        loop
        playsinline
        poster="https://picsum.photos/id/1025/1920/1080?blur=3"
      >
        <!-- 替换为稳定可用的视频链接 -->
        <source
          src="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4"
          type="video/mp4"
        />
        <!-- 视频无法加载时显示的替代背景 -->
        <div class="fallback-bg"></div>
      </video>

      <!-- 渐变遮罩层（增强文字可读性） -->
      <div class="bg-overlay"></div>

      <!-- 登录表单卡片 -->
      <div class="login">
        <!-- 标题 -->
        <div class="login-title">
          <h2>系统登录</h2>
          <p class="subtitle">请输入账号密码访问系统</p>
        </div>

        <el-form :model="loginForm" label-width="80px" label-position="top" class="login-form">
          <el-form-item label="账号">
            <el-input
              v-model="loginForm.account"
              placeholder="请输入账号"
              auto-complete="off"
              :prefix-icon="User"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              auto-complete="off"
              :prefix-icon="Lock"
            ></el-input>
          </el-form-item>
        </el-form>

        <div class="btnFootr">
          <el-button type="primary" @click="handleLogin" :loading="isLoading" :disabled="isLoading">
            {{ isLoading ? '登录中...' : '登录' }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// 引入Element Plus图标
@import 'element-plus/theme-chalk/el-icon.css';

/* 核心：禁用页面滚动 */
body {
  overflow: hidden;
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.loginbgc-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;

  .loginbgc {
    width: 100%;
    height: 100%;
    position: relative;
    animation: breathe 15s ease-in-out infinite;

    // 视频背景样式
    .bg-video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 0;
    }

    // 视频加载失败时的备用背景（太空主题）
    .fallback-bg {
      width: 100%;
      height: 100%;
      background: url('https://picsum.photos/id/1025/1920/1080') center/cover no-repeat;
    }

    // 渐变遮罩层（增强文字可读性）
    .bg-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6));
      z-index: 1;
    }

    // 登录框样式（太空科技感）
    .login {
      width: 500px;
      max-width: 90vw;
      height: auto;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 24px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(12px);
      padding: 30px 40px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
      animation: float 8s ease-in-out infinite;
      transition: all 0.3s ease;

      // 鼠标悬停效果
      &:hover {
        animation-play-state: paused;
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
      }

      // 登录标题样式
      .login-title {
        text-align: center;
        margin-bottom: 30px;

        h2 {
          color: #fff;
          margin: 0 0 8px 0;
          font-weight: 600;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .subtitle {
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
          font-size: 14px;
        }
      }

      // 表单样式
      .login-form {
        padding: 0;
      }
    }
  }
}

// 表单项样式优化
.el-form-item {
  margin-bottom: 24px;

  .el-form-item__label {
    color: #fff;
    font-size: 14px;
    margin-bottom: 8px;
    display: block;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .el-input {
    --el-input-bg-color: rgba(255, 255, 255, 0.05);
    --el-input-border-color: rgba(255, 255, 255, 0.3);
    --el-input-hover-border-color: rgba(255, 255, 255, 0.5);
    --el-input-focus-border-color: #4ca1ff;
    --el-input-text-color: #fff;
    --el-input-icon-color: rgba(255, 255, 255, 0.6);
    border-radius: 12px;
    height: 48px;

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    .el-input__wrapper {
      padding: 0 16px;
    }
  }
}

// 登录按钮容器
.btnFootr {
  display: flex;
  justify-content: center;
  margin-top: 30px;

  .el-button {
    width: 100%;
    height: 48px;
    background: linear-gradient(90deg, #4ca1ff, #698ef6);
    border: none;
    border-radius: 12px;
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    box-shadow: 0 4px 16px rgba(76, 161, 255, 0.4);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 24px rgba(76, 161, 255, 0.6);
      background: linear-gradient(90deg, #698ef6, #4ca1ff);
      color: #fff;
    }

    &:active {
      transform: translateY(1px);
      box-shadow: 0 2px 8px rgba(76, 161, 255, 0.4);
    }

    // 加载状态样式
    &.is-loading {
      background: linear-gradient(90deg, #4ca1ff, #698ef6);
      opacity: 0.8;
    }
  }
}

// 背景呼吸动画
@keyframes breathe {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

// 登录框漂浮动画
@keyframes float {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -52%) scale(1.01);
  }
}

// 移动端适配
@media (max-width: 576px) {
  .login {
    padding: 20px 16px !important;
  }

  .login-title {
    margin-bottom: 20px !important;
  }

  .el-form-item {
    margin-bottom: 16px !important;
  }

  .btnFootr {
    margin-top: 20px !important;
  }
}
</style>
