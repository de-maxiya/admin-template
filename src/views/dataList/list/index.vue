<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <h5>
        基础养老金 =（退休地上年度在岗职工月平均工资 + 本人指数化月平均缴费工资）÷ 2 × 缴费年限 × 1%
      </h5>
      <h5>个人账户养老金 = 个人账户储存额 ÷ 计发月数</h5>
      <h5>计发月数 = 60 岁退休：139 个月</h5>
      <p>
        假设： 退休地：北京，2024 年在岗职工月平均工资为 11000 元
        <br />
        本人平均缴费指数：1.0（按平均工资缴费）
        <br />
        缴费年限：25 年（实际缴费 25 年，无视同缴费）
        <br />
        个人账户储存额：15 万元（假设每月缴费 8%，25 年累计） 退休年龄：60 岁
      </p></el-col
    >
    <el-col :span="12">
      <h5>基础养老金</h5>
      <p>（11000 + 11000×1.0）÷ 2 × 25 × 1%</p>
      <p>22000÷2 × 25×0.01 = 2750</p>
      <h5>个人账户养老金</h5>
      <p>150000 ÷ 139 ≈ 1079 元</p>

      <h5>养老金总额</h5>
      <p>2750 + 1079 = 3829 元 / 月</p></el-col
    >
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
