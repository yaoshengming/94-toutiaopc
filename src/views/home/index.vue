<template>
<!-- 先在最外层放置一个大容器 因为 小容器只能放到大容器里面 -->
   <el-container>
     <!-- width左侧导航折叠状态改变 数值发生改变 -->
     <el-aside :style="{width: collapse ? '64px' : '300px'}"  style="transition:all 0.5s;background:#2e2f32">
       <!-- 左侧导航组件 直接把父组件的状态传给子组件 左侧导航菜单折叠 -->
       <layout-aside :collapse="collapse"></layout-aside>
     </el-aside>
     <!-- 右侧 再嵌套一个 el-container -->
     <el-container>
       <!-- 再上下布局 -->
       <el-header>
         <!-- 顶部操作栏组件 -->
        <layout-header></layout-header>
       </el-header>
       <!-- 主要区域 -->
       <el-main  style="padding: 0" >
          <!-- 这里应该放置 二级路由容器 -->
         <router-view></router-view>
     </el-main>
     </el-container>
   </el-container>
</template>

<script>
// 监听左侧导航菜单折叠
import eventBus from '@/utils/eventBus'
export default {
  data () {
    return {
      collapse: false// 默认是展开状态
    }
  },
  created () {
    eventBus.$on('changeCollapse', () => {
      // 此时表示折叠状态一定改变 一定与当前状态相反
      this.collapse = !this.collapse
    })
  }
}
</script>

<style>

</style>
