<script setup lang="ts">
import type { RouteLocationNormalized } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'
import { watch } from 'vue'

class RouteStack {
  private stack: RouteLocationNormalized[] = []
  constructor() {
    console.log(this.stack, 'stack')
  }
  add(route: RouteLocationNormalized) {
    console.log(route, '===312')
    const index = this.stack.findIndex((el) => el.path === route.path)
    if (index !== -1) {
      this.stack.splice(index, 1)
    }
    this.stack.push(route)
  }
  jump(targetIndex: number) {
    this.stack = this.stack.slice(0, targetIndex + 1)
  }

  getStack() {
    return this.stack
  }
}
const routeStack = new RouteStack()

const router = useRouter()
const route = useRoute()
const currentIndex = routeStack.getStack().length - 1

watch(
  route,
  (newRoute) => {
    console.log(123132, '312132')

    routeStack.add(newRoute)
  },
  { immediate: true },
)

const handleJump = (index: number) => {
  router.push(routeStack.getStack()[index].path)
  routeStack.jump(index)
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
          {{ item.meta?.title || '未知' }}
          <span v-if="index < currentIndex"> / </span>
        </span>
      </div>
    </div>
    <div class="rightTit">
      <!-- https://e-assets.gitee.com/gitee-community-web/_next/static/media/mjc.a8f527c7.png?x-bce-process=image -->
      <!-- https://picsum.photos/50/50 -->
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
