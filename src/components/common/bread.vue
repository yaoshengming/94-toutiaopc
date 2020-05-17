<template>
<!-- 使用element-ui的面包屑 设置分隔符 -->
  <el-breadcrumb separator=">" >
    <!-- 把el-breadcrumb-item当成router-link标签 -->
      <el-breadcrumb-item to="/home" >首页</el-breadcrumb-item>
  <!-- 第二个选项是动态的  需要传值的方式进来 props传值 slot插槽 -->
 <el-breadcrum-item>
<!-- 内容是动态的 -->
<!-- 定义一个具名插槽 -->
<slot name="title" ></slot>
 </el-breadcrum-item>
  </el-breadcrumb>
</template>

<script>
export default {

}
</script>

<style>

</style>
