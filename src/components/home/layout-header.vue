<template>
  <!-- <div class="layout-header">
      顶部操作栏组件
  </div> -->
  <!-- element-ui 布局组件 el-row和el-col-->
<el-row align="middle" type="flex"  class="layout-header" >
    <!-- 等分为两列  为什么是：span?  因为element-ui中span是number类型 不加：会认为是字符串就会报错 -->
<el-col  class="left"  :span="12" >
<!-- 图标 class为动态图标 左侧菜单折叠还是不折叠-->
<i  @click="collapse=!collapse" :class="{'el-icon-s-fold' : !collapse,'el-icon-s-unfold':collapse}" ></i>
<span>这里是小喵家</span>
</el-col>
<!-- 右侧列 -->

<el-col  class="right"  :span="12" >
<!-- 再次放置一个row组件 -->
<el-row type="flex" justify="end" align="middle" >
    <img :src="userInfo.photo">
    <!-- <img src="http://img1.imgtn.bdimg.com/it/u=3986366078,1066070541&fm=11&gp=0.jpg" alt="" srcset=""> -->
<!-- 下拉菜单 点击菜单会触发command事件-->
<el-dropdown  trigger="click" @command="clickMenu">
<!-- 显示的内容 -->
<span>{{userInfo.name}}</span>
<!-- 下拉内容需要做具名插槽dropdown  -->
<el-dropdown-menu  slot="dropdown" >
    <!-- 下拉选项el-dropdown-item作为下拉选项组件 -->
<el-dropdown-item command="info">个人信息</el-dropdown-item>
<el-dropdown-item command="git">git地址</el-dropdown-item>
<el-dropdown-item command="lgout">退出</el-dropdown-item>
</el-dropdown-menu>
</el-dropdown>
</el-row>
</el-col>
</el-row>
</template>

<script>
// eventBus公共事件监听  头像用户名实时更新
import eventBus from '@/utils/eventBus'
export default {
  data () {
    return {
      userInfo: {}, // 用户个人信息
      collapse: false// 开始左侧导航菜单不是折叠
    }
  },
  // 监听左侧导航菜单折叠状态
  watch: {
    collapse () {
      // 折叠状态变化 通知左侧导航组件
      eventBus.$emit('changeCollapse')// 触发一个改变折叠状态的事件
    }
  },
  methods: {
    clickMenu (command) {
      // 需要处理三种情况
      if (command === 'info') {
        // 点击了个人信息
      } else if (command === 'git') {
      // 如果点击了git就跳转到git仓库
        window.location.href = 'https://github.com/yaoshengming/94-toutiaopc'
      } else {
        // 退出系统1.删除token 2.跳转登录页
        window.localStorage.removeItem('urse-token')// 删除localstorage中某个选项
        this.$router.push('/login')// 跳回登录页  编程式导航
      }
    },
    // 封装获取数据的方法
    getUserInfo () {
      // 获取用户个人信息
      this.$axios({
        url: '/user/profile' // 请求地址
      // headers: {
      //   Authorization: `Bearer ${token}`// 格式要求Bearer+token
      // }// 请求头参数
      }).then(result => {
      // 如果加载成功我们要将数据赋值给userInfo
        this.userInfo = result.data
      })
    }
  },
  created () {
    // const token = localStorage.getItem('urse-token')// 从兜里拿钥匙 也就是从缓存中取token
    // 获取用户个人信息
    this.getUserInfo()// 正常加载
    eventBus.$on('updateUser', () => {
      // 如果有人触发了updateUser事件 就会进入到该函数
      // 有人更改用户信息 应该重新获取信息
      this.getUserInfo()
    })
  }
}
</script>

<style  lang="less"  scoped>
.layout-header{
    height: 60px;
    .left{
    i{
      font-size: 20px;
     }
    }
    .right{
        img{
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 4px;
        }
    }
}
</style>
