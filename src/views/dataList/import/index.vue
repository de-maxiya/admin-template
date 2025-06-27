<template>
  <el-row :gutter="20">
    <el-col :span="12"> 1231323121323123</el-col>
  </el-row>

  <el-form
    :label-position="'top'"
    label-width="auto"
    :model="formLabelAlign"
    style="max-width: 600px"
  >
    <el-form-item label="去年当地社会平均工资" :label-position="itemLabelPosition">
      <el-input v-model="formLabelAlign.Salary" placeholder="请输入去年当地社会平均工资"></el-input>
    </el-form-item>
    <el-form-item label="本人指数化月平均缴费挡位" :label-position="itemLabelPosition">
      <el-input
        v-model="formLabelAlign.Gear"
        placeholder="请输入本人指数化月平均缴费挡位"
      ></el-input>
    </el-form-item>
    <el-form-item label="缴费年限" :label-position="itemLabelPosition">
      <el-input v-model="formLabelAlign.year" placeholder="请输入缴费年限" />
    </el-form-item>

    <el-form-item label="操作">
      <el-button type="primary" @click="handleCalculate">计算</el-button>

      <span v-if="resValue">
        {{ resValue }}
      </span>
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
  Salary: '',
  Gear: '',
  year: '',
})
const resValue = ref(0)
const handleCalculate = () => {
  const { Salary, Gear, year } = formLabelAlign
  if (!Salary || !Gear || !year) {
    return ElMessage({
      message: '请检查是否内容全部填写.',
      type: 'warning',
    })
  }

  const resAll = ((Number(Salary) + Number(Salary) * Number(Gear)) / 2) * Number(year) * 0.01
  const person = (Number(Salary) * 0.08 * 12 * Number(year)) / 139
  console.log(resAll, person)

  resValue.value = Math.floor(resAll + person)
}
</script>
<style scoped lang="scss"></style>
