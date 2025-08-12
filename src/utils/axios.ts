import axios, { AxiosError } from 'axios'
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

const baseURL = import.meta.env.VITE_API_BASE_URL
const service = axios.create({
  baseURL,
  timeout: 5000,
  withCredentials: true,
})

service.interceptors.request.use(
  // 直接用内部配置类型约束
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

// 响应拦截器（你代码里后续可补充完整）
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 这里可根据实际响应结构处理，比如校验code等
    return response.data
  },
  (error: AxiosError) => {
    if (error.message.includes('timeout')) {
      ElMessage.error('请求超时，请稍后重试')
    } else {
      // ElMessage.error('网络连接错误，请检查网络')
      ElMessage.error(error.message)
    }
    return Promise.reject(error)
  },
)

export default service
