<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, watch, onMounted } from 'vue'
// 修正类名：RouerStak -> RouteStack

const route = useRoute()
const router = useRouter()
const routeAllList = ref<{ path: string; meta: object }[]>([])

// 使用 ref 确保 currentIndex 响应式
const currentIndex = ref(0)
onMounted(() => {
  if (routeAllList.value.some((it) => it.path === route.path)) return
  routeAllList.value.push({
    path: route.path,
    meta: route.meta,
  })
  currentIndex.value = routeAllList.value.length - 1
})
watch(
  route,
  (newRoute) => {
    if (routeAllList.value.some((it) => it.path === newRoute.path)) return
    routeAllList.value.push({
      path: newRoute.path,
      meta: newRoute.meta,
    })
    currentIndex.value = routeAllList.value.length - 1
  },
  { immediate: true, deep: true },
)

const handleJump = async (index: number) => {
  currentIndex.value = index // 更新当前索引

  router.push(routeAllList.value[index].path)
}
</script>

<template>
  <div class="navbar">
    <div class="leftTit">
      <div v-for="(item, index) in routeAllList" :key="index" class="breadcrumb">
        <span @click="handleJump(index)" :class="{ active: index === currentIndex }">
          {{ item.meta?.title || item.path }}
        </span>
      </div>
    </div>
    <div class="rightTit">
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
  color: blueviolet;
}
</style>
