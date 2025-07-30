<template>
  <el-button type="primary" @click="dialogVisible = true">新增</el-button>
  <el-button type="primary" @click="getList()">搜索</el-button>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="id" label="ID" width="180" />
    <el-table-column prop="name" label="用户名称" width="180" />
    <el-table-column prop="age" label="用户年龄" width="180" />
    <el-table-column prop="status" label="用户状态" width="180" />
    <el-table-column prop="gender" label="用户性别" width="180" />
    <el-table-column prop="img" label="用户头像">
      <template #default="scope">
        <el-image style="width: 100px; height: 100px" :src="scope.row.img"></el-image>
      </template>
    </el-table-column>

    <el-table-column prop="" label="操作">
      <template #default="scope">
        <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>

        <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog v-model="dialogVisible" title="新增" width="30%" :before-close="handleClose">
    <el-form ref="form" :model="formall" label-width="80px" label-position="top">
      <el-form-item label="名称">
        <el-input v-model="formall.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="年龄">
        <el-input v-model="formall.age" placeholder="请输入年龄"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-input v-model="formall.status" placeholder="请输入状态"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-input v-model="formall.gender" placeholder="请输入性别"></el-input>
      </el-form-item>

      <el-form-item label="图片地址">
        <el-input v-model="formall.img" placeholder="请输入图片地址"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleAddRole">
          {{ isEdit ? '编辑' : '新增' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import axios from 'axios'
import { ref, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
const tableData = ref([])
const dialogVisible = ref(false)
let formall = reactive({
  name: '',
  age: '',
  status: '',
  gender: '',
  img: '',
})

onMounted(async () => {
  await getList()
})

const getList = async () => {
  await axios.get('/admin/api/user').then((res) => {
    tableData.value = res.data.data
    console.log(res, '==321')
  })
}

const handleClose = () => {
  formall = {
    name: '',
    age: '',
    status: '',
    gender: '',
    img: '',
  }
  dialogVisible.value = false
  isEdit.value = false
}
// 'http://p3.music.126.net/T-pj5y9uahizQ6UhUygYdg==/109951171457557274.jpg?imageView=&thumbnail=336y336&type=webp&rotate=0&tostatic=0'
// https://p1.music.126.net/n_GTguQS1xx9W81K-uoxww==/109951170687031355.jpg?imageView=&thumbnail=336y336&type=webp&rotate=0&tostatic=0
// http://p3.music.126.net/e85aIwIu-ePI5xBO_C90DA==/109951171393072843.jpg?imageView=&thumbnail=336y336&type=webp&rotate=0&tostatic=0

const handleAddRole = () => {
  axios
    .post('/admin/api/user', {
      name: formall.name,
      age: formall.age,
      status: formall.status,
      gender: formall.gender,
      img: formall.img,
    })
    .then((res) => {
      if (res.data.code === 200) {
        ElMessage({
          message: '新增成功',
          type: 'success',
        })
        getList()
      }
    })
}

interface RowType {
  id: number
  name: string
  age: string
  status: string
  gender: string
  img: string
}
const isEdit = ref(false)
const handleEdit = (row: RowType) => {
  isEdit.value = true
  dialogVisible.value = true
  formall = row
}

const handleDelete = (row: RowType) => {
  axios.delete(`/admin/api/user/${row.id}`).then((res) => {
    if (res.data.code === 200) {
      ElMessage({
        message: '删除成功',
        type: 'success',
      })
      getList()
    }
  })
}
</script>

<style scoped lang="scss"></style>
