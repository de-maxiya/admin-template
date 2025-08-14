<template>
  <h5>计算个人养老金</h5>
  <p>个人每年缴纳12000元</p>
  <p>复利，每年复利一次</p>
  <p>假设60岁退休，输入缴费年限和每年缴费多少钱</p>

  <el-form
    :label-position="'top'"
    label-width="auto"
    :model="formLabelAlign"
    style="max-width: 600px"
  >
    <el-form-item label="年缴费金额" :label-position="itemLabelPosition">
      <el-input v-model="formLabelAlign.price" placeholder="请输入年缴费金额"></el-input>
    </el-form-item>
    <el-form-item label="年利率" :label-position="itemLabelPosition">
      <el-input v-model="formLabelAlign.rate" placeholder="请输入年利率，例如4%"></el-input>
    </el-form-item>
    <el-form-item label="缴费年限" :label-position="itemLabelPosition">
      <el-input v-model="formLabelAlign.year" placeholder="请输入缴费年限" />
    </el-form-item>

    <el-form-item label="操作">
      <el-button type="primary" @click="handleCalculate">计算</el-button>

      <span v-if="resValue"> 计算结果：{{ resValue }} </span>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormItemProps } from 'element-plus'

const itemLabelPosition = ref<FormItemProps['labelPosition']>('')
itemLabelPosition.value = 'top'
const formLabelAlign = reactive({
  price: '',
  rate: '',
  year: '',
})
const resValue = ref(0)
const handleCalculate = () => {
  const { price, rate, year } = formLabelAlign
  if (!price || !rate || !year) {
    return ElMessage({
      message: '请检查是否内容全部填写.',
      type: 'warning',
    })
  }
  let allPrice = 0
  for (let i = 0; i < Number(year); i++) {
    allPrice += Number(price)
    allPrice = Number(allPrice) * (Number(rate) / 100) + Number(allPrice)
  }

  resValue.value = +allPrice.toFixed(2)
}
</script>
<style scoped lang="scss"></style>
