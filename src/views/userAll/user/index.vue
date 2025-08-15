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
        <el-image style="width: 50px; height: 50px" :src="scope.row.img"></el-image>
      </template>
    </el-table-column>

    <el-table-column prop="" label="操作">
      <template #default="scope">
        <el-button link :type="'primary'" @click="handleEdit(scope.row)">编辑</el-button>

        <el-button link :type="'danger'" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-pagination
    v-model:current-page="pageAll.page"
    v-model:page-size="pageAll.pageSize"
    :page-sizes="[10, 20]"
    :size="size"
    :disabled="disabled"
    :background="background"
    layout="total, ->, sizes, prev, pager, next, jumper"
    :total="count"
    style="margin: 20px 20px 0"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />

  <el-dialog v-model="dialogVisible" title="新增" width="30%" :before-close="handleClose">
    <el-form ref="form" :model="formall" label-width="80px" label-position="top">
      <el-form-item label="账号">
        <el-input v-model="formall.account" :disabled="isEdit" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="密码" v-if="!isEdit">
        <el-input v-model="formall.password" placeholder="请输入名称"></el-input>
      </el-form-item>
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
        <el-input
          v-model="formall.img"
          :disabled="!!formall.img"
          placeholder="请输入图片地址"
        ></el-input>
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
<script setup>
import axios from '@/utils/axios'
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 加密
// 加密相关变量
const cryptoData = reactive({
  serverPublicKey: '', // 服务器公钥
  clientPrivateKey: '', // 客户端私钥
  clientPublicKey: '', // 客户端公钥
  sharedSecret: '', // 共享密钥
})

// 初始化加密相关密钥
const initCrypto = async () => {
  try {
    // 1. 获取服务器公钥
    await getServerPublicKey()
    // 2. 生成客户端密钥对并交换
    await generateClientKeyPair()
    await exchangePublicKey()
    return true
  } catch (error) {
    console.error('加密初始化失败:', error)
    ElMessage.error('加密初始化失败，请重试')
    return false
  }
}

// 获取服务器公钥（复用登录页面逻辑）
const getServerPublicKey = async () => {
  try {
    const res = await axios.get('/admin/api/auth/ecdh/public/key')
    if (res.code === 200 && res.data.serverPublicKey) {
      cryptoData.serverPublicKey = res.data.serverPublicKey
      return true
    }
    console.log(res, '==321')

    throw new Error('获取服务器公钥失败')
  } catch (error) {
    console.error('获取服务器公钥错误:', error)
    throw error
  }
}

// 生成客户端ECDH密钥对（复用登录页面逻辑）
const generateClientKeyPair = () => {
  return new Promise((resolve, reject) => {
    window.crypto.subtle
      .generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveKey', 'deriveBits'])
      .then((keyPair) => {
        return window.crypto.subtle.exportKey('spki', keyPair.publicKey).then((spkiBuffer) => {
          const uint8Array = new Uint8Array(spkiBuffer)
          const rawPublicKey = uint8Array.slice(-65) // 提取未压缩公钥（65字节）
          const clientPublicKey = btoa(String.fromCharCode(...rawPublicKey))

          cryptoData.clientPublicKey = clientPublicKey
          cryptoData.clientPrivateKey = keyPair.privateKey
          resolve(true)
        })
      })
      .catch((error) => {
        console.error('生成密钥对失败:', error)
        reject(error)
      })
  })
}

// 交换公钥并计算共享密钥（复用登录页面逻辑）
const exchangePublicKey = async () => {
  try {
    const res = await axios.post(
      '/admin/api/auth/ecdh/exchange',
      { clientPublicKey: cryptoData.clientPublicKey },
      { withCredentials: true },
    )

    if (res.success) {
      // 导入服务器公钥
      const serverPublicKey = await window.crypto.subtle.importKey(
        'raw',
        Uint8Array.from(atob(cryptoData.serverPublicKey), (c) => c.charCodeAt(0)),
        { name: 'ECDH', namedCurve: 'P-256' },
        false,
        [],
      )

      // 派生共享密钥
      const sharedSecret = await window.crypto.subtle.deriveBits(
        { name: 'ECDH', public: serverPublicKey },
        cryptoData.clientPrivateKey,
        256,
      )

      // 存储共享密钥
      cryptoData.sharedSecret = Array.from(new Uint8Array(sharedSecret))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')

      return true
    }

    throw new Error('密钥交换失败')
  } catch (error) {
    console.error('密钥交换错误:', error)
    throw error
  }
}

// AES加密函数（复用登录页面逻辑）
const encryptData = async (data, ivHex) => {
  try {
    // 将共享密钥和IV转换为ArrayBuffer
    const keyBuffer = Uint8Array.from(cryptoData.sharedSecret.match(/.{1,2}/g) || [], (byte) =>
      parseInt(byte, 16),
    )
    const ivBuffer = Uint8Array.from(ivHex.match(/.{1,2}/g) || [], (byte) => parseInt(byte, 16))

    // 导入密钥
    const key = await window.crypto.subtle.importKey('raw', keyBuffer, { name: 'AES-CBC' }, false, [
      'encrypt',
    ])

    // 加密数据
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-CBC', iv: ivBuffer },
      key,
      new TextEncoder().encode(data),
    )

    // 转换为十六进制字符串
    return Array.from(new Uint8Array(encrypted))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  } catch (error) {
    console.error('加密失败:', error)
    throw error
  }
}

const size = ref('default')
const background = ref(true)
const disabled = ref(false)
const pageAll = ref({
  page: 1,
  pageSize: 10,
})
const handleSizeChange = (val) => {
  console.log(`${val} items per page`)
  pageAll.value.pageSize = val
  getList()
}
const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`)
  pageAll.value.page = val
  getList()
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
const formall = ref({
  account: '',
  password: '',
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
      tableData.value = res.data.list
      count.value = res.data.count
      loading.value = false
    })
}

const loading = ref(false)

// 关闭
const handleClose = () => {
  formall.value = {
    name: '',
    age: '',
    status: '',
    gender: '',
    img: '',
  }

  dialogVisible.value = false
  isEdit.value = false
}

// 新增
const handleAddRole = async () => {
  // 表单验证
  if (isEdit.value) {
    axios
      .put(`/admin/api/user/${formall.value.id}`, {
        account: formall.value.account,
        name: formall.value.name,
        age: formall.value.age,
        status: formall.value.status,
        gender: formall.value.gender,
        img: formall.value.img,
      })
      .then(async (res) => {
        if (res.code === 200) {
          dialogVisible.value = false
          ElMessage({
            message: '编辑成功',
            type: 'success',
          })
          await getList()
        }
      })
    // 编辑
  } else {
    if (!formall.value.account) {
      ElMessage.error('请输入账号')
      return
    }
    if (!formall.value.password) {
      ElMessage.error('请输入密码')
      return
    }
    // 新增
    // 确保加密初始化完成
    const cryptoReady = await initCrypto()
    if (!cryptoReady) {
      return
    }
    // 生成新的IV用于本次加密
    const iv = window.crypto.getRandomValues(new Uint8Array(16))
    const ivHex = Array.from(iv)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')

    // 加密密码
    const encryptedPassword = await encryptData(formall.value.password, ivHex)
    axios
      .post('/admin/api/user', {
        account: formall.value.account,
        password: encryptedPassword,
        name: formall.value.name,
        age: formall.value.age,
        status: formall.value.status,
        gender: formall.value.gender,
        img: formall.value.img,
      })
      .then(async (res) => {
        if (res.code === 200) {
          dialogVisible.value = false
          ElMessage({
            message: '新增成功',
            type: 'success',
          })
          await getList()
        }
      })
  }
}

// 编辑

const isEdit = ref(false)
const handleEdit = (row) => {
  isEdit.value = true
  dialogVisible.value = true
  formall.value = JSON.parse(JSON.stringify(row))
}

//  删除
const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除吗？', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      axios.delete(`/admin/api/user/${row.id}`).then((res) => {
        if (res.code === 200) {
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
