<template>
  <div class="login">
    <!-- 表单 -->
    <el-card class="login-card">
      <!-- 表单内容 -->
      <!-- 头部logo部分 -->
      <div class="title">
        <img src="../../assets/img/logo_index.png" alt />
      </div>
      <!-- 表单 绑定model属性 绑定rules属性（表单验证规则）ref给el-form一个属性-->
      <el-form ref="loginForm" :model="loginForm"  :rules="loginRules"  style="margin-top:20px">
        <!-- 表单容器 设置prop属性 prop表示要校验的字段名-->
        <el-form-item prop="mobile">
          <!-- 表单域 -->
          <el-input  v-model="loginForm.mobile"  placeholder="请输入手机号"></el-input>
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item prop="code"  >
          <el-input v-model="loginForm.code" style="width:60%" placeholder="请输入验证码"></el-input>
          <!-- 放置一个按钮 -->
          <el-button style="float:right" plain>发送验证码</el-button>
        </el-form-item>
        <!-- 表单域 -->
        <el-form-item  prop="checked"  >
          <!-- 是否同意被人家坑 -->
          <el-checkbox v-model="loginForm.checked">我已阅读同意用户协议和隐私条款</el-checkbox>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item   >
          <el-button @click="login" style="width:100%" type="primary">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        mobile: '', // 手机号
        code: '', // 验证码
        checked: false// 是否同意用户协议
      },
      // 定义表单验证规则
      loginRules: {
        mobile: [{ required: true, message: '您的手机号不能为空' }, {
          pattern: /^[1]([3-9])[0-9]{9}$/,
          message: '您的手机号格式不正确'// 正则表达式
        }],
        code: [{ required: true, message: '您的验证码不能为空' }, {
          pattern: /^\d{6}$/,
          message: '请输入6位数字的验证码'
        }],
        // 自定义校验 required不能校验true/false
        checked: [{
          validator: function (rule, value, callback) {
            // rule是当前校验规则
            // value是当前要校验的字段值
            // callback是一个回调函数 无论成功或失败 都要执行
            // 成功执行callback  失败执行callback(new Error(""))
            // new Error(错误信息)就是我们提示的错误信息
            value ? callback() : callback(new Error('您需要同意协议才能执行'))
          }
        }]
      }
    }
  },
  methods: {
    login () {
      //    this.$refs.loginForm 获取的就是el-form的对象实例
      this.$refs.loginForm.validate().then(() => {
        console.log(123)
        // 如果成功通过 校验就会到达 then
        // 通过校验之后 应该做什么事 -> 应该调用登录接口 看看手机号是否正常
        //   this.$axios.get/post/delete/put
        this.$axios({
          url: '/authorizations', // 请求地址
          data: this.loginForm,
          // data: { ...this.loginForm, checked: null }, // body请求体参数
          method: 'post'
        }).then(result => {
          // 成功 之后打印结果
        //  把钥匙放兜里 也就是把token存于本地缓存
          window.localStorage.setItem('urse-token', result.data.token)
          // 跳转到主页
          this.$router.push('/home')// push和router-link类似to属性 可以直接是字符串 也可以是对象
        }).catch(() => {
          // 提示消息
          this.$message.error('用户名或密码错误')
        })
      })
    }
  }
}
</script>

<style lang='less' scoped>
// 加了scoped属性 就只会对当前自己的组件起作用
// 如果需要写less 需要在style标签中 lang='less'
.login {
  background-image: url("../../assets/img/1.jpg");
  height: 100vh; // 当前屏幕可视区域分成100份
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-card {
    width: 440px;
    height: 340px;
    .title {
      text-align: center;
      img {
        height: 40px;
      }
    }
  }
}
</style>
