<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useLoginStore } from '@/stores/login'
import { User, Lock, RefreshRight } from '@element-plus/icons-vue'
import axios from '../../utils/axios'

// 加密相关变量
const cryptoData = reactive({
  serverPublicKey: '', // 服务器公钥
  clientPrivateKey: '', // 客户端私钥
  clientPublicKey: '', // 客户端公钥
  sharedSecret: '', // 共享密钥
  captcha: {
    svg: '', // 验证码SVG
    encryptedText: '', // 加密的验证码文本
    iv: '', // 加密向量
  },
})

// 登录表单数据
const loginForm = ref({
  account: '',
  password: '',
  captcha: '',
  remember: false,
})

// 状态变量
const isLoading = ref(false)
const isKeyExchanged = ref(false)
const captchaLoading = ref(false)

// 路由和状态管理
const loginStore = useLoginStore()
const router = useRouter()

// 页面加载时初始化
onMounted(async () => {
  try {
    // 1. 获取服务器公钥
    await getServerPublicKey()
    // 2. 生成客户端密钥对并交换
    await generateClientKeyPair()
    await exchangePublicKey()
    // 3. 获取验证码
    await getCaptcha()
  } catch (error) {
    console.error('初始化失败:', error)
    ElMessage.error('初始化失败，请刷新页面重试')
  }
})

// 1. 获取服务器公钥
const getServerPublicKey = async () => {
  try {
    const res = await axios.get('/admin/api/auth/ecdh/public/key')
    if (res.code === 200 && res.data.serverPublicKey) {
      cryptoData.serverPublicKey = res.data.serverPublicKey
      return true
    }

    console.log(res, '==res')

    throw new Error('获取服务器公钥失败')
  } catch (error) {
    console.error('获取服务器公钥错误:', error)
    throw error
  }
}

// 2. 生成客户端ECDH密钥对
const generateClientKeyPair = () => {
  return new Promise((resolve, reject) => {
    window.crypto.subtle
      .generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveKey', 'deriveBits'])
      .then((keyPair) => {
        return window.crypto.subtle.exportKey('spki', keyPair.publicKey).then((spkiBuffer) => {
          // 关键：从 SPKI 格式中提取原始公钥（最后65字节）
          const uint8Array = new Uint8Array(spkiBuffer)
          const rawPublicKey = uint8Array.slice(-65) // 提取未压缩公钥（65字节）

          // 转换为 base64（仅原始公钥部分）
          const clientPublicKey = btoa(String.fromCharCode(...rawPublicKey))

          cryptoData.clientPublicKey = clientPublicKey
          cryptoData.clientPrivateKey = keyPair.privateKey
          console.log('客户端原始公钥（base64）:', clientPublicKey.substring(0, 30) + '...')
          resolve(true)
        })
      })
      .catch((error) => {
        console.error('生成密钥对失败:', error)
        reject(error)
      })
  })
}

// 3. 交换公钥并计算共享密钥
const exchangePublicKey = async () => {
  try {
    const res = await axios.post(
      '/admin/api/auth/ecdh/exchange',
      { clientPublicKey: cryptoData.clientPublicKey },
      { withCredentials: true },
    )

    if (res.success) {
      // 1. 导入服务器公钥（关键修改：用 'raw' 格式，而非 'spki'）
      const serverPublicKey = await window.crypto.subtle.importKey(
        'raw', // 改为 'raw' 格式（匹配后端返回的原始公钥）
        Uint8Array.from(atob(cryptoData.serverPublicKey), (c) => c.charCodeAt(0)),
        { name: 'ECDH', namedCurve: 'P-256' }, // 保持与曲线匹配
        false,
        [],
      )

      // 2. 派生共享密钥（参数不变）
      const sharedSecret = await window.crypto.subtle.deriveBits(
        { name: 'ECDH', public: serverPublicKey },
        cryptoData.clientPrivateKey,
        256,
      )

      // 3. 存储共享密钥（不变）
      cryptoData.sharedSecret = Array.from(new Uint8Array(sharedSecret))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')

      isKeyExchanged.value = true
      return true
    }

    throw new Error('密钥交换失败')
  } catch (error) {
    console.error('密钥交换错误:', error)
    throw error
  }
}
// 4. 获取验证码
const getCaptcha = async () => {
  if (!isKeyExchanged.value) {
    ElMessage.warning('请先完成密钥交换')
    return
  }

  captchaLoading.value = true
  try {
    const res = await axios.get('/admin/api/auth/captcha')
    console.log(res, '===123')

    if (res.code) {
      cryptoData.captcha.svg = res.data.captchaSvg
      cryptoData.captcha.encryptedText = res.data.encryptedCaptcha
      cryptoData.captcha.iv = res.data.iv
      return true
    }
    throw new Error('获取验证码失败')
  } catch (error) {
    console.error('获取验证码错误:', error)
    ElMessage.error('获取验证码失败，请重试')
    throw error
  } finally {
    captchaLoading.value = false
  }
}

// 刷新验证码
const refreshCaptcha = async () => {
  try {
    await getCaptcha()
    loginForm.value.captcha = '' // 清空输入
  } catch (error) {
    console.error('刷新验证码失败:', error)
  }
}

// AES加密函数
const encryptData = async (data: string, ivHex: string) => {
  try {
    // 将共享密钥和IV转换为ArrayBuffer
    const keyBuffer = Uint8Array.from(cryptoData.sharedSecret.match(/.{1,2}/g) || [], (byte) =>
      parseInt(byte, 16),
    )
    const ivBuffer = Uint8Array.from(ivHex.match(/.{1,2}/g) || [], (byte) => parseInt(byte, 16))

    // 导入密钥
    const key = await window.crypto.subtle.importKey('raw', keyBuffer, { name: 'AES-CBC' }, false, [
      'encrypt',
    ])

    // 加密数据
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-CBC', iv: ivBuffer },
      key,
      new TextEncoder().encode(data),
    )

    // 转换为十六进制字符串
    return Array.from(new Uint8Array(encrypted))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  } catch (error) {
    console.error('加密失败:', error)
    throw error
  }
}

// 处理登录
const handleLogin = async () => {
  // 表单验证
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
  if (!isKeyExchanged.value) {
    ElMessage.error('密钥交换未完成，请刷新页面重试')
    return
  }

  isLoading.value = true
  try {
    // 生成新的IV用于本次加密
    const iv = window.crypto.getRandomValues(new Uint8Array(16))
    const ivHex = Array.from(iv)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')

    // 加密密码和验证码
    const encryptedPassword = await encryptData(loginForm.value.password, ivHex)
    const encryptedCaptcha = await encryptData(loginForm.value.captcha, ivHex)

    // 发送登录请求
    const res = await axios.post('/admin/api/auth/login', {
      account: loginForm.value.account, // 账号明文传输（一般账号不需要加密）
      encryptedPassword,
      encryptedUserCaptcha: encryptedCaptcha,
      iv: ivHex,
    })

    // 处理登录结果
    if (res.token) {
      ElMessage.success('登录成功，正在进入系统...')
      // 存储token等信息

      loginStore.setToken(res.token)
      loginStore.setUserInfo({ username: loginForm.value.account })

      // 记住我功能实现
      if (loginForm.value.remember) {
        localStorage.setItem('username', loginForm.value.account)
        // 实际项目中不建议存储密码，这里仅为示例
      } else {
        localStorage.removeItem('username')
      }

      setTimeout(() => {
        console.log('登录成功')

        router.push({ name: 'home' })
      }, 1000)
    } else {
      ElMessage.error(res.message || '登录失败')
      refreshCaptcha() // 登录失败刷新验证码
    }
  } catch (error) {
    console.error('登录错误:', error)
    ElMessage.error('登录失败，请重试')
    refreshCaptcha() // 登录失败刷新验证码
  } finally {
    isLoading.value = false
  }
}

// 离线登录逻辑
const handleOfflineLogin = () => {
  ElMessage.info('进入离线登录流程...')
  // 可跳转离线登录页面或执行离线逻辑
  // router.push({ name: 'offline-login' })
}

// 注册逻辑
const createDialog = ref(false)
const handleOpenCreate = () => {
  createDialog.value = true

  loginForm.value.account = ''
  loginForm.value.password = ''
  loginForm.value.captcha = ''
}

// 注册处理函数（完整逻辑，复用Web Crypto API）
const handleCreate = async () => {
  // 1. 基础表单验证
  if (!loginForm.value.account) {
    ElMessage.error('请输入账号')
    return
  }
  if (!loginForm.value.password) {
    ElMessage.error('请输入密码')
    return
  }

  try {
    // 2. 完成ECDH密钥交换（复用登录的Web Crypto API逻辑）
    const { sharedSecret: regSharedSecret, iv: regIv } = await initECDHExchangeWithWebCrypto()
    // 3. 用共享密钥加密密码（AES-256-CBC，与登录加密逻辑一致）
    const encryptedPassword = await encryptDataWithKey(
      loginForm.value.password,
      regIv,
      regSharedSecret,
    )

    // 4. 发送注册请求
    const res = await axios.post('/admin/api/auth/create', {
      account: loginForm.value.account,
      name: loginForm.value.name || loginForm.value.account, // 可选用户名
      encryptedPassword: encryptedPassword,
      iv: regIv, // 加密向量（转为16进制字符串）
    })

    // 5. 处理注册结果
    if (res.code === 200) {
      ElMessage.success('注册成功')
      createDialog.value = false
      loginForm.value = { account: '', password: '', captcha: '', remember: false }
      // 1. 获取服务器公钥
      await getServerPublicKey()
      // 2. 生成客户端密钥对并交换
      await generateClientKeyPair()
      await exchangePublicKey()
      // 3. 获取验证码
      await getCaptcha()
    }
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '注册失败，请重试')
    console.error('注册错误:', error)
  }
}
// 新增：带密钥参数的加密函数（避免依赖全局变量）
const encryptDataWithKey = async (data: string, ivHex: string, sharedSecret: string) => {
  try {
    // 使用传入的共享密钥，而非全局的cryptoData.sharedSecret
    const keyBuffer = Uint8Array.from(sharedSecret.match(/.{1,2}/g) || [], (byte) =>
      parseInt(byte, 16),
    )
    const ivBuffer = Uint8Array.from(ivHex.match(/.{1,2}/g) || [], (byte) => parseInt(byte, 16))

    const key = await window.crypto.subtle.importKey('raw', keyBuffer, { name: 'AES-CBC' }, false, [
      'encrypt',
    ])

    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-CBC', iv: ivBuffer },
      key,
      new TextEncoder().encode(data),
    )

    return Array.from(new Uint8Array(encrypted))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  } catch (error) {
    console.error('加密失败:', error)
    throw error
  }
}
// 初始化ECDH密钥交换（使用Web Crypto API，与登录逻辑一致）
const initECDHExchangeWithWebCrypto = async () => {
  try {
    // 1. 生成客户端ECDH密钥对（P-256曲线，与后端匹配）
    const keyPair = await window.crypto.subtle.generateKey(
      { name: 'ECDH', namedCurve: 'P-256' },
      true, // 允许提取密钥
      ['deriveBits'], // 仅用于派生共享密钥
    )

    // 2. 导出客户端公钥（原始格式，65字节未压缩）
    const publicKeyBuffer = await window.crypto.subtle.exportKey('spki', keyPair.publicKey)
    const uint8Array = new Uint8Array(publicKeyBuffer)
    const rawPublicKey = uint8Array.slice(-65) // 提取最后65字节（未压缩公钥）
    const clientPublicKey = btoa(String.fromCharCode(...rawPublicKey))

    // 3. 获取服务器公钥
    const serverPubRes = await axios.get('/admin/api/auth/ecdh/public/key')
    if (serverPubRes.code !== 200 || !serverPubRes.data.serverPublicKey) {
      throw new Error('获取服务器公钥失败')
    }
    const serverPublicKey = serverPubRes.data.serverPublicKey

    // 4. 发送客户端公钥给后端，完成交换
    const exchangeRes = await axios.post(
      '/admin/api/auth/ecdh/exchange',
      { clientPublicKey },
      { withCredentials: true },
    )
    if (!exchangeRes.success) {
      throw new Error('密钥交换失败: ' + (exchangeRes.data?.message || '未知错误'))
    }

    // 5. 导入服务器公钥（原始格式）
    const serverPubBuffer = Uint8Array.from(atob(serverPublicKey), (c) => c.charCodeAt(0))
    const importedServerPubKey = await window.crypto.subtle.importKey(
      'raw', // 原始公钥格式（65字节）
      serverPubBuffer,
      { name: 'ECDH', namedCurve: 'P-256' },
      false, // 不可提取
      [], // 无需用法
    )

    // 6. 派生共享密钥（256位）
    const sharedSecretBits = await window.crypto.subtle.deriveBits(
      { name: 'ECDH', public: importedServerPubKey },
      keyPair.privateKey,
      256, // 密钥长度
    )

    // 7. 转换共享密钥为16进制字符串（与登录逻辑一致）
    const sharedSecret = Array.from(new Uint8Array(sharedSecretBits))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')

    // 8. 生成随机IV（16字节，用于AES加密）
    const iv = window.crypto.getRandomValues(new Uint8Array(16))
    const ivHex = Array.from(iv)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')

    return { sharedSecret, iv: ivHex }
  } catch (error) {
    throw new Error('密钥交换失败: ' + (error instanceof Error ? error.message : '未知错误'))
  }
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
            alt="系统Logo"
          />
          <p class="subtitle">欢迎回来，请登录您的账号</p>
        </div>

        <el-form :model="loginForm" label-width="80px" label-position="top" class="login-form">
          <!-- 账号 -->
          <el-form-item label="账号">
            <template #label>
              <span style="color: #fff">账号</span>
            </template>
            <el-input
              v-model="loginForm.account"
              placeholder="请输入账号"
              auto-complete="off"
              :prefix-icon="User"
            ></el-input>
          </el-form-item>

          <!-- 密码 -->
          <el-form-item label="密码">
            <template #label>
              <span style="color: #fff">密码</span>
            </template>
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              auto-complete="off"
              :prefix-icon="Lock"
            ></el-input>
          </el-form-item>

          <!-- 验证码 -->
          <el-form-item v-if="!createDialog" label="验证码">
            <template #label>
              <span style="color: #fff">验证码</span>
            </template>
            <el-input
              v-model="loginForm.captcha"
              placeholder="请输入验证码"
              auto-complete="off"
              style="width: 100%"
            >
              <!-- 验证码图片 + 刷新按钮 -->
              <template #suffix>
                <div class="captcha-wrapper">
                  <div
                    class="captcha-img"
                    @click="refreshCaptcha"
                    v-html="cryptoData.captcha.svg"
                    :class="{ 'captcha-loading': captchaLoading }"
                  ></div>
                  <el-icon class="refresh-icon" @click="refreshCaptcha">
                    <RefreshRight />
                  </el-icon>
                </div>
              </template>
            </el-input>
          </el-form-item>

          <!-- 记住我 + 忘记密码 -->
          <el-form-item v-if="!createDialog">
            <div class="remember-forgot">
              <div>
                <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
              </div>
              <div>
                <el-link type="primary" @click="() => ElMessage.info('忘记密码逻辑待实现')"
                  >忘记密码？</el-link
                >
                <el-link type="primary" @click="handleOpenCreate">注册</el-link>
              </div>
            </div>
          </el-form-item>
        </el-form>

        <!-- 登录按钮 + 离线登录按钮 -->
        <div class="btn-group" v-if="!createDialog">
          <el-button type="primary" @click="handleLogin" :loading="isLoading" :disabled="isLoading">
            {{ isLoading ? '登录中...' : '登录' }}
          </el-button>
          <el-button type="info" @click="handleOfflineLogin" :disabled="isLoading">
            离线登录
          </el-button>
        </div>
        <div v-else class="btn-group">
          <el-button
            type="primary"
            @click="handleCreate"
            :loading="isLoading"
            :disabled="isLoading"
          >
            注册
          </el-button>
          <el-button type="info" @click="createDialog = false" :disabled="isLoading">
            取消注册
          </el-button>
        </div>

        <!-- 版权信息 -->
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
          background-color: #fff;
          width: 150px;
          height: 48px;
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
