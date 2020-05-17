<template>
  <!-- <div class="layout-header">
      顶部操作栏组件
  </div> -->
  <!-- element-ui 布局组件 el-row和el-col-->
<el-row align="middle" type="flex"  class="layout-header" >
    <!-- 等分为两列  为什么是：span?  因为element-ui中span是number类型 不加：会认为是字符串就会报错 -->
<el-col  class="left"  :span="12" >
<!-- 图标 -->
<i class="el-icon-s-fold" ></i>
<span>小喵家的小鱼干有限公司</span>
</el-col>
<!-- 右侧列 -->

<el-col  class="right"  :span="12" >
<!-- 再次放置一个row组件 -->
<el-row type="flex" justify="end" align="middle" >
    <!-- <img :src="userInfo.photo"> -->
    <img src="http://img1.imgtn.bdimg.com/it/u=3986366078,1066070541&fm=11&gp=0.jpg" alt="" srcset="">
<!-- 下拉菜单 点击菜单会触发command事件-->
<el-dropdown  trigger="click" @command="clickMenu">
<!-- 显示的内容 -->
<span>是你</span>
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
export default {
  data () {
    return {
      userInfo: {}// 用户个人信息
    }
  },
  methods: {
    clickMenu (command) {
      // 需要处理三种情况
      if (command === 'info') {
        // 点击了个人信息
      } else if (command === 'git') {
      // 如果点击了git苍鹭就跳转到git仓库
        window.location.href = 'https://github.com/yaoshengming/94-toutiaopc'
      } else {
        // 退出系统1.删除token 2.跳转登录页
        window.localStorage.removeItem('user-token')// 删除localstorage中某个选项
        this.$router.push('/login')// 跳回登录页  编程式导航
      }
    }
  },
  created () {
    const token = localStorage.getItem('user-token')// 从兜里拿钥匙 也就是从缓存中取token
    // 获取用户个人信息
    this.$axios({
      url: '/user/profile', // 请求地址
      headers: {
        Authorization: `Bearer ${token}`// 格式要求Bearer+token
      }// 请求头参数
    }).then(result => {
      // 如果加载成功我们要将数据赋值给userInfo
      // this.userInfo = result.data.data
      debugger
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
