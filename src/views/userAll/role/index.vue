<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="id" label="ID" width="180" />
    <el-table-column prop="name" label="用户名称" width="180" />
    <el-table-column prop="url" label="用户头像" />
  </el-table>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
const tableData = ref([])

// const tableData = [
//   {
//     date: '2016-05-03',
//     name: 'Tom',
//     address: 'No. 189, Grove St, Los Angeles',
//   },
//   {
//     date: '2016-05-02',
//     name: 'Tom',
//     address: 'No. 189, Grove St, Los Angeles',
//   },
//   {
//     date: '2016-05-04',
//     name: 'Tom',
//     address: 'No. 189, Grove St, Los Angeles',
//   },
//   {
//     date: '2016-05-01',
//     name: 'Tom',
//     address: 'No. 189, Grove St, Los Angeles',
//   },
// ]
</script>

<style scoped lang="scss"></style>
