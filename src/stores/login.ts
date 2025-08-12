// import { defineStore } from 'pinia'

// export const useLoginStore = defineStore('login', {
//   state: () => ({
//     token: '',
//     // 添加用户信息状态
//     userInfo: {
//       username: '', // 初始化为空对象或包含默认字段
//     },
//   }),
//   actions: {
//     // 设置token的方法
//     setToken(newToken: string) {
//       this.token = newToken
//     },

//     // 添加设置用户信息的方法
//     setUserInfo(info: { username: string }) {
//       this.userInfo = info
//     },
//   },
// })

// @/stores/login.js
import { defineStore } from 'pinia'

export const useLoginStore = defineStore('login', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}'),
    lastVerifyTime: 0,
  }),
  actions: {
    // 设置token
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },
    // 设置用户信息
    setUserInfo(info) {
      this.userInfo = info
      localStorage.setItem('userInfo', JSON.stringify(info))
    },
    // 退出登录方法
    logout() {
      // 1. 清除本地存储的token和用户信息
      this.token = ''
      this.userInfo = {}
      this.lastVerifyTime = 0
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')

      // 2. 可选：通知后端清除会话（如果需要）
      // return axios.post('/api/auth/logout')
    },
  },
})
