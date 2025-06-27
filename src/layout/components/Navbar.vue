<script setup lang="ts">
import { routeStack } from './routers'
import { useRoute, useRouter } from 'vue-router'
import { ref, watch, onMounted, nextTick } from 'vue'
import { useBrandCrumbStore } from '@/stores/menu/navbar'
// 修正类名：RouerStak -> RouteStack
const counter = useBrandCrumbStore()

console.log(counter, '==copunter')

const router = useRouter()
const route = useRoute()

// 使用 ref 确保 currentIndex 响应式
const currentIndex = ref(routeStack.getStack().length - 1)
onMounted(() => {
  routeStack.add({
    path: route.path,
    meta: route.meta,
  })
  counter.increment(routeStack.getStack().length - 1)
  currentIndex.value = routeStack.getStack().length - 1
})
watch(
  route,
  (newRoute) => {
    routeStack.add({
      path: newRoute.path,
      meta: newRoute.meta,
    })
    counter.increment(routeStack.getStack().length - 1)
    currentIndex.value = routeStack.getStack().length - 1
  },
  { immediate: true, deep: true },
)

const handleJump = async (index: number) => {
  console.log(index, '==213')
  currentIndex.value = index // 更新当前索引
  // routeStack.jump(index)
  await nextTick()
  counter.increment(index)
  router.push(routeStack.getStack()[index].path)
}
</script>

<template>
  <div class="navbar">
    <div class="leftTit">
      <div class="breadcrumb">
        <span
          v-for="(item, index) in routeStack.getStack()"
          :key="index"
          @click="handleJump(index)"
          :class="{ active: index === counter.count }"
        >
          {{ index }} + {{ counter.count }}
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
  padding: 10px;
  background: #f5f7fa;
  border-bottom: 1px solid #e6e9ef;
}
.breadcrumb span {
  cursor: pointer;
  margin-right: 5px;
  color: #303133;
}
.breadcrumb span.active {
  font-weight: bold;
  color: blueviolet;
}
</style>
