<template>
 <el-card>
        <!-- 账户信息 -->
        <bread-crumb slot='header'>
          <template slot='title'>账户信息</template>
        </bread-crumb>
        <!-- 放置表单容器 -->
        <el-form  :model="formData" :rules="rules"  ref="myForm" label-width="100px">
          <!-- 表单域 -->
          <el-form-item   prop="name" label="用户名">
            <el-input  v-model="formData.name"   style="width:30%"></el-input>
          </el-form-item >
              <!-- 表单域 -->
          <el-form-item label="简介">
                  <el-input  v-model="formData.intro"   style="width:30%"></el-input>
          </el-form-item>
          <el-form-item   prop="email" label="邮箱">
              <el-input    v-model="formData.email"    style="width:30%"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <!-- 手机号可以看 但是手机号不能改 因为手机号是登录的标识 -->
             <el-input     v-model="formData.mobile"   disabled style="width:30%"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button  @click="save"  type='primary'>保存</el-button>
          </el-form-item>
        </el-form>
        <!-- 头像 -->
        <el-upload action="" :http-request="uploadImg" :show-file-list="false">
          <img class='head-upload' :src="formData.photo ? formData.photo : defaultImg" alt="">
        </el-upload>
  </el-card>
</template>

<script>
import eventBus from '@/utils/eventBus'
export default {
  data () {
    return {
      formData: {
        name: '',
        intro: '',
        photo: '',
        email: '',
        mobile: ''
      },
      rules: {
        name: [{ required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 1, max: 7, message: '用户名的长度为1-7位' }
        ],
        email: [{ required: true, message: '邮箱不能为空', trigger: 'blur' },
          { pattern: /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/, message: '邮箱格式不正确', trigger: 'blur' }
        ]
      },
      defaultImg: require('../../assets/img/hd.jpg')
    }
  },
  methods: {
    // 保存用户
    save () {
      this.$refs.myForm.validate().then(() => {
        this.$axios({
          url: '/user/profile',
          method: 'patch',
          data: this.formData
        }).then(() => {
          this.$message.success('保存用户信息成功')// eventBus监听 广播一个消息
          eventBus.$emit('updateUser')
        }).catch(() => {
          this.$message.error('保存用户信息失败')
        })
      })
    },
    // 上传图片
    uploadImg (params) {
      const data = new FormData()
      data.append('photo', params.file)
      this.$axios({
        url: '/user/photo',
        method: 'patch',
        data// 要传递的参数
      }).then(result => {
        this.formData.photo = result.data.photo
        // 拿到新头像地址了 你需要把新地址赋值给当前页面的地址
      })
    },
    // 获取用户个人资料
    getUserInfo () {
      this.$axios({
        url: '/user/profile'
      }).then(result => {
        this.formData = result.data// 将数据赋值给表单数据
      })
    }
  },
  created () {
    this.getUserInfo()// 调用方法
  }
}
</script>

<style>
.head-upload {
  position: absolute;
  right: 350px;
  top:160px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
}
</style>
