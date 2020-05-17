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
    <img src="http://img3.imgtn.bdimg.com/it/u=3683328035,1562039468&fm=11&gp=0.jpg" alt="">
<!-- 下拉菜单 -->
<el-dropdown  trigger="click">
<!-- 显示的内容 -->
<span>是小喵呀</span>
<!-- 下拉内容需要做具名插槽dropdown  -->
<el-dropdown-menu  slot="dropdown" >
    <!-- 下拉选项el-dropdown-item作为下拉选项组件 -->
<el-dropdown-item>个人信息</el-dropdown-item>
<el-dropdown-item>git地址</el-dropdown-item>
<el-dropdown-item>退出</el-dropdown-item>
</el-dropdown-menu>
</el-dropdown>
</el-row>
</el-col>
</el-row>
</template>

<script>
export default {

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
