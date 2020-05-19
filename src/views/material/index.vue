<template>
  <el-card>
    <!-- 放置面包屑 -->
    <bread-crumb slot="header">
      <!-- 具名插槽 -->
      <template slot="title">素材管理</template>
    </bread-crumb>
      <!-- 放置标签页 v-model所绑定的值 就是当前所激活的页签-->
       <!-- @tab-click  是切换tab页签时 进行事件监听 element-ui-->
        <el-tabs v-model="activeName" @tab-click="changeTab" >
            <!-- 放置标签 label表示标签显示的名称 name代表页签的选中的值-->
            <el-tab-pane label="全部素材" name='all'>
                <!-- 内容 循环生成页面结构 -->
                <div class='img-list'>
                    <!-- 采用v-for对list数据进行循环 -->
                    <el-card class='img-card' v-for="item in list" :key="item.id">
                        <!-- 放置图片 并且赋值 图片地址-->
                        <img :src="item.url" alt="">
                        <!-- 操作栏 可以flex布局-->
                        <el-row class='operate' type='flex' align="middle" justify="space-around">
                           <i class='el-icon-star-on'></i>
                           <i class='el-icon-delete-solid'></i>
                        </el-row>
                    </el-card>
                </div>
            </el-tab-pane>
            <el-tab-pane     label="收藏素材" name='collect'>
                <!-- 内容 -->
        <!-- 内容 循环生成页面结构 -->
                <div class='img-list'>
                    <!-- 采用v-for对list数据进行循环 -->
                    <el-card class='img-card' v-for="item in list" :key="item.id">
                        <!-- 放置图片 并且赋值 图片地址-->
                        <img :src="item.url" alt="">
                    </el-card>
                </div>
            </el-tab-pane>

        </el-tabs>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      activeName: 'all', // 当前激活的页签 默认选中素材
      list: [] // 全部素材的数据 接收全部素材
    }
  },
  methods: {
    // 获取素材数据
    getMaterial () {
      this.$axios({
        url: '/user/images', // 请求地址
        params: {
          collect: this.activeName === 'collect' // 变逻辑  变成两个方法都可以采用的方式
        }, // get参数 也就是query参数
        data: {} // data参数 放的是body参数
      }).then(result => {
        this.list = result.data.results
      })
    },
    changeTab () {
    // 在切换事件中
    // 可以根据当前acticeName来决定是获取哪个方面的数据
    // activeName === 'all'获取所有素材 activeName === 'collect' 获取收藏素材
      this.getMaterial()// 重复代码  采用调用方法 改变上面getMaterial ()中collect原本写死的值
    }
  },
  created () {
    // 实例化之后 调用获取素材数据
    this.getMaterial()// 获取素材数据
  }
}
</script>

<style lang='less'  scoped>
 .img-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      .img-card {
          width: 220px;
          height: 240px;
          margin: 20px 40px;
          position: relative;
          img {
              width: 100%;
              height: 100%;
          }
          .operate {
              position: absolute;
              left:0;
              bottom:0;
              width: 100%;
              background: #f4f5f6;
              height: 30px;
              i  {
                  font-size:20px;
              }
          }
      }
  }
</style>
