<template>
  <el-form ref="form" :model="formSearch" label-width="80px" label-position="top">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-form-item label="ID">
          <el-input v-model="formSearch.id" placeholder=""></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="用户名称">
          <el-input v-model="formSearch.name" placeholder=""></el-input> </el-form-item
      ></el-col>
      <el-col :span="6">
        <el-form-item label="用户年龄">
          <el-input v-model="formSearch.age" placeholder=""></el-input> </el-form-item
      ></el-col>
      <el-col :span="6">
        <el-form-item label="用户状态">
          <el-input v-model="formSearch.status" placeholder=""></el-input> </el-form-item
      ></el-col>
      <el-col :span="6">
        <el-form-item label="用户性别">
          <el-input v-model="formSearch.gender" placeholder=""></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <div style="margin-top: 30px">
          <el-button type="primary" @click="dialogVisible = true">新增</el-button>
          <el-button type="primary" @click="getList()">搜索</el-button>
        </div>
      </el-col>
    </el-row>
  </el-form>

  <el-table v-loading="loading" :data="tableData" style="width: 100%">
    <el-table-column prop="id" label="ID" width="180" />
    <el-table-column prop="account" label="用户账号" width="180" />
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
        <el-button link :type="'primary'" @click="handleEdit(scope.row)">编辑</el-button>

        <el-button link :type="'danger'" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!--
  https://p1.music.126.net/KkmOZTtSD9Cse5Cwf_9L3A==/109951170020022216.jpg?imageView=&thumbnail=336y336&type=webp&rotate=0&tostatic=0

  https://p1.music.126.net/MvJMnAgamdI0R9aQXEJ9yw==/109951169632995337.jpg?imageView=&thumbnail=336y336&type=webp&rotate=0&tostatic=0
  -->
  <el-pagination
    v-model:current-page="currentPage4"
    v-model:page-size="pageSize4"
    :page-sizes="[100, 200, 300, 400]"
    :size="size"
    :disabled="disabled"
    :background="background"
    layout="total, sizes, prev, pager, next, jumper"
    :total="400"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />

  <el-dialog v-model="dialogVisible" title="新增" width="30%" :before-close="handleClose">
    <el-form ref="form" :model="formall" label-width="80px" label-position="top">
      <el-form-item label="名称">
        <el-input v-model="formall.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="年龄">
        <el-input v-model="formall.age" placeholder="请输入年龄"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="formall.status" placeholder="请选择状态">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="formall.gender" placeholder="请选择性别">
          <el-option
            v-for="item in genderOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="图片地址">
        <el-input v-model="formall.img" :disabled="isEdit" placeholder="请输入图片地址"></el-input>
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
import type { ComponentSize } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
const currentPage4 = ref(4)
const pageSize4 = ref(100)
const size = ref<ComponentSize>('default')
const background = ref(false)
const disabled = ref(false)

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}

const tableData = ref([])
const dialogVisible = ref(false)
const formSearch = reactive({
  id: '',
  age: '',
  name: '',
  status: '',
  gender: '',
})
let formall = reactive({
  name: '',
  age: '',
  status: '',
  gender: '',
  img: '',
})
const statusOptions = [
  {
    label: '正常',
    value: '1',
  },
  {
    label: '已经注册',
    value: '2',
  },
  {
    label: '未注册',
    value: '3',
  },
  {
    label: '禁用',
    value: '0',
  },
]
const genderOptions = [
  {
    label: '男',
    value: 1,
  },
  {
    label: '女',
    value: 0,
  },
]

onMounted(async () => {
  await getList()
})
const pageAll = ref({
  page: 1,
  pageSize: 10,
})

const count = ref(0)
// 获取数据
const getList = async () => {
  loading.value = true
  await axios
    .get('/admin/api/user', {
      params: {
        ...formSearch,
        page: pageAll.value.page,
        pageSize: pageAll.value.pageSize,
      },
    })
    .then((res) => {
      tableData.value = res.data.data.list
      count.value = res.data.data.count
      loading.value = false
    })
}

const loading = ref(false)

// 关闭
const handleClose = () => {
  Object.assign(formall, {
    name: '',
    age: '',
    status: '',
    gender: '',
    img: '',
  })
  dialogVisible.value = false
  isEdit.value = false
}

// 新增
const handleAddRole = () => {
  axios
    .post('/admin/api/user', {
      name: formall.name,
      age: formall.age,
      status: formall.status,
      gender: formall.gender,
      img: formall.img,
    })
    .then(async (res) => {
      console.log(res, '===231`312')

      if (res.data.code === 200) {
        dialogVisible.value = false
        ElMessage({
          message: '新增成功',
          type: 'success',
        })
        await getList()
      }
    })
}

// 编辑
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

//  删除
const handleDelete = (row: RowType) => {
  ElMessageBox.confirm('确认删除吗？', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      axios.delete(`/admin/api/user/${row.id}`).then((res) => {
        if (res.data.code === 200) {
          ElMessage({
            message: '删除成功',
            type: 'success',
          })
          getList()
        }
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled',
      })
    })
}
</script>

<style scoped lang="scss"></style>
