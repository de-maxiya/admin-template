<template>
  <div style="width: 2000px">
    <div id="main" style="width: 100%; height: 1000px"></div>
  </div>
</template>

<style scoped lang="scss"></style>

<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted } from 'vue'

type EChartsOption = echarts.EChartsOption

onMounted(() => {
  // 在onMounted内部获取DOM并初始化图表，确保DOM已加载
  const chartDom = document.getElementById('main')
  if (!chartDom) {
    console.error('未找到ID为main的元素')
    return
  }

  const myChart = echarts.init(chartDom)

  // 图表配置项放在onMounted内部，确保能访问到myChart
  const option: EChartsOption = {
    title: {
      text: 'Basic Radar Chart',
    },
    legend: {
      data: ['Allocated Budget', 'Actual Spending'],
    },
    radar: {
      // shape: 'circle',
      indicator: [
        { name: 'Sales', max: 6500 },
        { name: 'Administration', max: 16000 },
        { name: 'Information Technology', max: 30000 },
        { name: 'Customer Support', max: 38000 },
        { name: 'Development', max: 52000 },
        { name: 'Marketing', max: 25000 },
      ],
    },
    series: [
      {
        name: 'Budget vs spending',
        type: 'radar',
        data: [
          {
            value: [4200, 3000, 20000, 35000, 50000, 18000],
            name: 'Allocated Budget',
          },
          {
            value: [5000, 14000, 28000, 26000, 42000, 21000],
            name: 'Actual Spending',
          },
        ],
      },
    ],
  }

  // 设置图表配置
  myChart.setOption(option)

  // 窗口大小变化时重绘图表
  const handleResize = () => {
    myChart.resize()
  }

  window.addEventListener('resize', handleResize)

  // 组件卸载时移除事件监听，防止内存泄漏
  return () => {
    window.removeEventListener('resize', handleResize)
  }
})
</script>
