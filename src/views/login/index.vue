<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useLoginStore } from '@/stores/login'
import { User, Lock, RefreshRight } from '@element-plus/icons-vue' // 新增验证码刷新图标

const loginForm = ref({
  account: 'lsj', // 默认账号
  password: '123456', // 示例密码
  captcha: '', // 新增验证码字段
  remember: false, // 记住我
})
const captchaSrc = ref(
  'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4',
) // 验证码接口（需替换为真实接口）
const isLoading = ref(false)
const loginStore = useLoginStore()
const router = useRouter()

// 模拟获取验证码（实际需调用后端接口）
const refreshCaptcha = () => {
  // 这里替换为真实的验证码接口请求
  captchaSrc.value = `https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4?${Date.now()}`
}

const handleLogin = async () => {
  if (!loginForm.value.account) {
    ElMessage.error('请输入账号')
    return
  }
  if (!loginForm.value.password) {
    ElMessage.error('请输入密码')
    return
  }
  if (!loginForm.value.captcha) {
    ElMessage.error('请输入验证码')
    return
  }

  isLoading.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 800))

    // 模拟登录校验（实际需调用后端接口）
    if (
      loginForm.value.account === 'lsj' &&
      loginForm.value.password === '123456' &&
      loginForm.value.captcha === 'EJE2' // 示例验证码，实际需后端校验
    ) {
      ElMessage.success('登录成功，正在进入系统...')
      loginStore.increment(true)
      setTimeout(() => {
        router.push({ name: 'home' })
      }, 1000)
    } else {
      ElMessage.error('账号、密码或验证码错误，请重试')
      refreshCaptcha() // 校验失败时刷新验证码
    }
  } finally {
    isLoading.value = false
  }
}

// 离线登录逻辑（根据实际需求实现）
const handleOfflineLogin = () => {
  ElMessage.info('进入离线登录流程...')
  // 可跳转离线登录页面或执行离线逻辑
  // router.push({ name: 'offline-login' })
}
</script>

<template>
  <div class="loginbgc-container">
    <div class="loginbgc">
      <video
        class="bg-video"
        autoplay
        muted
        loop
        playsinline
        poster="https://picsum.photos/id/1025/1920/1080?blur=3"
      >
        <source
          src="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4"
          type="video/mp4"
        />
        <div class="fallback-bg"></div>
      </video>
      <div class="bg-overlay"></div>

      <div class="login">
        <div class="login-title">
          <img
            src="https://p1.music.126.net/XmmQY9RuWF1RY-Z3QmA9Sg==/109951165545584764.jpg?imageView=&thumbnail=336y336&type=webp&rotate=0&tostatic=0"
            style="width: 100px; height: 100px"
            alt=""
          />
          <!-- <h2>系统登录</h2> -->
          <p class="subtitle">欢迎回来，请登录您的账号</p>
        </div>

        <el-form :model="loginForm" label-width="80px" label-position="top" class="login-form">
          <!-- 账号 -->
          <el-form-item label="账号">
            <el-input
              v-model="loginForm.account"
              placeholder="请输入账号"
              auto-complete="off"
              :prefix-icon="User"
            ></el-input>
          </el-form-item>

          <!-- 密码 -->
          <el-form-item label="密码">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              auto-complete="off"
              :prefix-icon="Lock"
            ></el-input>
          </el-form-item>

          <!-- 验证码 -->
          <el-form-item label="验证码">
            <el-input
              v-model="loginForm.captcha"
              placeholder="请输入验证码"
              auto-complete="off"
              style="width: 100%"
            >
              <!-- 验证码图片 + 刷新按钮 -->
              <template #suffix>
                <div class="captcha-wrapper">
                  <img
                    :src="captchaSrc"
                    alt="captcha"
                    class="captcha-img"
                    @click="refreshCaptcha"
                  />
                  <el-icon class="refresh-icon" @click="refreshCaptcha">
                    <RefreshRight />
                  </el-icon>
                </div>
              </template>
            </el-input>
          </el-form-item>

          <!-- 记住我 + 忘记密码 -->
          <el-form-item>
            <div class="remember-forgot">
              <div>
                <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
              </div>
              <div>
                <el-link type="primary" @click="() => ElMessage.info('忘记密码逻辑待实现')"
                  >忘记密码？</el-link
                >
              </div>
            </div>
          </el-form-item>
        </el-form>

        <!-- 登录按钮 + 离线登录按钮 -->
        <div class="btn-group">
          <el-button type="primary" @click="handleLogin" :loading="isLoading" :disabled="isLoading">
            {{ isLoading ? '登录中...' : '登录' }}
          </el-button>
          <el-button type="info" @click="handleOfflineLogin" :disabled="isLoading">
            离线登录
          </el-button>
        </div>

        <!-- 版权信息 -->
        <!-- <div class="copyright">© 2025 Great Li CRM. © Great Li CRM. 版权所有。</div> -->
        <div class="copyright">© 2025 lsj. 版权所有。</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import 'element-plus/theme-chalk/el-icon.css';

/* 核心样式保持原有逻辑 */
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

    .bg-video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 0;
    }

    .fallback-bg {
      width: 100%;
      height: 100%;
      background: url('https://picsum.photos/id/1025/1920/1080') center/cover no-repeat;
    }

    .bg-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6));
      z-index: 1;
    }

    .login {
      width: 500px;
      max-width: 90vw;
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

      &:hover {
        animation-play-state: paused;
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
      }

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

      .login-form {
        padding: 0;
      }

      /* 验证码样式 */
      .captcha-wrapper {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;

        .captcha-img {
          width: 80px;
          height: 36px;
          object-fit: cover;
          border-radius: 4px;
        }

        .refresh-icon {
          color: rgba(255, 255, 255, 0.6);
          font-size: 18px;
          transition: color 0.3s;

          &:hover {
            color: #fff;
          }
        }
      }

      /* 记住我 + 忘记密码 */
      .remember-forgot {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #fff;
        font-size: 14px;

        .el-checkbox {
          --el-checkbox-font-color: #fff;
        }
      }

      /* 按钮组 */
      .btn-group {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 20px;

        .el-button {
          height: 48px;
          border-radius: 12px;
          font-size: 16px;
          margin-left: 0px;
          transition: all 0.3s ease;
          width: 100%;

          &:hover {
            transform: translateY(-2px);
          }

          &:active {
            transform: translateY(1px);
          }
        }
      }

      /* 版权信息 */
      .copyright {
        text-align: center;
        color: rgba(255, 255, 255, 0.6);
        font-size: 12px;
        margin-top: 20px;
      }
    }
  }
}

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

@keyframes breathe {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -52%) scale(1.01);
  }
}

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

  .btn-group {
    margin-top: 16px !important;
  }
}
</style>
