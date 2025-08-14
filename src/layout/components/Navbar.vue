<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, watch, onMounted, defineProps } from 'vue'
import { ElMessage } from 'element-plus'
import { useLoginStore } from '@/stores/login'
import axios from '../../utils/axios'
const loginStore = useLoginStore()

const route = useRoute()
const router = useRouter()

const routeAllList = ref([])

// 使用 ref 确保 currentIndex 响应式
const currentIndex = ref(0)
onMounted(() => {
  if (routeAllList.value.some((it) => it.path === route.path)) return
  const meta = route.meta
  routeAllList.value.push({
    path: route.path,
    meta,
  })
  currentIndex.value = routeAllList.value.length - 1
})
watch(
  route,
  (newRoute) => {
    if (routeAllList.value.some((it) => it.path === newRoute.path)) {
      const index = routeAllList.value.findIndex((it) => it.path === newRoute.path)

      currentIndex.value = index
    } else {
      if (newRoute.path === '/login') return
      // 如果满足10条，删除第一条数据
      if (routeAllList.value.length === 10) routeAllList.value.shift()
      // 只有不存在，才会新增
      const meta = newRoute.meta
      routeAllList.value.push({
        path: newRoute.path,
        meta,
      })
      const index = routeAllList.value.findIndex((it) => it.path === newRoute.path)

      currentIndex.value = index
    }
  },
  { immediate: true },
)

const handleJump = async (index) => {
  currentIndex.value = index // 更新当前索引

  router.push(routeAllList.value[index].path)
}

// 在组件中

const handleLogout = async () => {
  try {
    // 调用退出登录方法
    loginStore.logout() // 如果logout有后端请求，需要await

    const res = await axios.post('/admin/api/auth/logout', {}, { withCredentials: true })

    console.log(res, '==321')

    // 确保路由跳转
    router.push({ name: 'login' })

    // 显示退出成功提示
    ElMessage.success('退出成功')
  } catch (error) {
    console.error('退出失败', error)
    ElMessage.error('退出失败，请重试')
  }
}

defineProps({
  isCollapse: {
    type: Boolean,
    default: false,
  },
})
import {
  Setting,
  SwitchButton,
  Monitor,
  ChromeFilled,
  ElementPlus,
  Sunny,
  Moon,
} from '@element-plus/icons-vue'
</script>

<template>
  <div
    class="allTit"
    :style="{
      left: isCollapse ? '100px' : '260px',
      width: isCollapse ? 'calc(100% - 116px)' : 'calc(100% - 276px)',
    }"
  >
    <div
      class="leftTit"
      :style="{
        left: isCollapse ? '100px' : '260px',
      }"
    >
      <div v-for="(item, index) in routeAllList" :key="index" class="breadcrumb">
        <span @click="handleJump(index)" :class="{ active: index === currentIndex }">
          {{ item.meta.title }}
        </span>
      </div>
    </div>

    <div class="rightTit">
      <!-- <img
      src="https://picsum.photos/50/50"
      alt="用户头像"
      class="w-8 h-8 rounded-full object-cover"
      style="width: 50px; height: 50px"
    /> -->
      <!-- <el-avatar :size="50" :src="circleUrl" /> -->
      <el-button :icon="Monitor" />
      <el-button :icon="ChromeFilled" />
      <el-button :icon="ElementPlus" />
      <el-button :icon="Setting" />
      <el-button :icon="Sunny || Moon" />
      <el-button @click="handleLogout" :icon="SwitchButton" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.allTit {
  position: fixed;
  top: 0;

  height: 70px;
  z-index: 99;
  background-color: #f5f5f5;
}
.leftTit {
  position: fixed;
  top: 20px;
}
.rightTit {
  .el-button {
    margin: 0;
    height: 50px;
    line-height: 50px;
    border: none;
    font-size: 20px;
  }
  position: fixed;
  top: 10px;
  right: 30px;
}

.breadcrumb {
  display: inline-block; /* 确保行内元素支持transform */
  transition: transform 0.3s ease; /* 过渡动画：0.3秒缓动效果 */
}
.breadcrumb:hover span {
  background-color: white;
  transform: translateY(-3px); /* 上移3像素 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 可选：添加阴影增强立体感 */
  // color: blueviolet;
  margin-bottom: -2px;
}
.breadcrumb span {
  padding: 10px;
  background: #f5f7fa;
  border-radius: 10px;
  box-shadow: 0 0 5px #e6e9ef;
  border-bottom: 1px solid #e6e9ef;

  cursor: pointer;
  color: #303133;
  margin: 0 20px 0 0;
}
.breadcrumb span.active {
  font-weight: bold;
  color: #579cfe;
  background-color: white;
}
</style>
