<script setup lang="ts">
import { routeStack } from './routers'
import { useRoute, useRouter } from 'vue-router'
import { ref, watch, onMounted } from 'vue'
// 修正类名：RouerStak -> RouteStack

const router = useRouter()
const route = useRoute()

// 使用 ref 确保 currentIndex 响应式
const currentIndex = ref(routeStack.getStack().length - 1)
onMounted(() => {
  routeStack.add({
    path: route.path,
    meta: route.meta,
  })
  currentIndex.value = routeStack.getStack().length - 1
  console.log('初始化路由栈:', route.path)
})
watch(
  route,
  (newRoute) => {
    console.log('路由变化:', newRoute.path, routeStack.getStack())
    routeStack.add({
      path: newRoute.path,
      meta: newRoute.meta,
    })
    currentIndex.value = routeStack.getStack().length - 1
  },
  { immediate: true, deep: true },
)

const handleJump = (index: number) => {
  console.log(index, '==213')
  currentIndex.value = index // 更新当前索引
  routeStack.jump(index)

  router.push(routeStack.getStack()[index].path)
}
</script>

<template>
  <div class="navbar">
    <div class="leftTit">
      <div class="breadcrumb">
        <span
          v-for="(item, index) in routeStack.getStack()"
          :key="item.path"
          @click="handleJump(index)"
          :class="{ active: index === currentIndex }"
        >
          {{ item.meta?.title || item.path }}
          <span v-if="index < currentIndex"> / </span>
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
  padding: 10px;
  background: #f5f7fa;
  border-bottom: 1px solid #e6e9ef;
}
.breadcrumb span {
  cursor: pointer;
  margin-right: 5px;
  color: #409eff;
}
.breadcrumb span.active {
  font-weight: bold;
  color: #303133;
}
</style>
