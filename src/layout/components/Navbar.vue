<script setup lang="ts">
import type { RouteLocationNormalized } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'
import { ref, watch } from 'vue'
// 修正类名：RouerStak -> RouteStack
class RouteStack {
  private stack: RouteLocationNormalized[] = []

  add(route: RouteLocationNormalized) {
    console.log('添加路由:', route.path, this.stack)

    // 避免重复添加相同路由（如刷新页面或重复访问同一页面）
    if (this.stack.length > 0 && this.stack[this.stack.length - 1].path === route.path) {
      return
    }

    // 保留完整历史记录，不删除已存在的同一路由
    this.stack.push(route)

    // 限制最大长度，避免内存溢出
    if (this.stack.length > 20) {
      this.stack.shift()
    }

    console.log(
      '当前路由栈:',
      this.stack.map((item) => item.path),
    )
  }

  jump(targetIndex: number) {
    this.stack = this.stack.slice(0, targetIndex + 1)
    console.log(
      '跳转后栈:',
      this.stack.map((item) => item.path),
    )
  }

  getStack() {
    return this.stack
  }
}

const routeStack = new RouteStack()
const router = useRouter()
const route = useRoute()

// 使用 ref 确保 currentIndex 响应式
const currentIndex = ref(routeStack.getStack().length - 1)

watch(
  route,
  (newRoute: RouteLocationNormalized) => {
    console.log('路由变化:', newRoute.path, routeStack.getStack())
    routeStack.add(newRoute)
    currentIndex.value = routeStack.getStack().length - 1
  },
  { immediate: true },
)

const handleJump = (index: number) => {
  router.push(routeStack.getStack()[index].path)
  routeStack.jump(index)
  currentIndex.value = index // 更新当前索引
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
