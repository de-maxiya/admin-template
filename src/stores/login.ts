import { defineStore } from 'pinia'

export const useLoginStore = defineStore('login', {
  state: () => ({
    token: '',
    // 添加用户信息状态
    userInfo: {
      username: '', // 初始化为空对象或包含默认字段
    },
  }),
  actions: {
    // 设置token的方法
    setToken(newToken: string) {
      this.token = newToken
    },

    // 添加设置用户信息的方法
    setUserInfo(info: { username: string }) {
      this.userInfo = info
    },
  },
})
