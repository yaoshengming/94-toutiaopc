<template>
  <!-- 二级路由的默认组件 -->
  <div class="second-home">
    <!-- 幻灯片 -->
    <el-carousel :interval="4000" type="card" height="300px">
      <el-carousel-item v-for="item in list" :key="item">
        <img :src="item" alt />
      </el-carousel-item>
    </el-carousel>
    <!-- 放置图表组件 -->
    <!-- <div  ref="myChart"  class="eharts"></div> -->
  </div>
</template>
<script>
// 引入图表模块
// import ECharts from 'echarts'
export default {
  // mounted () {
  //   // 进行图表的实例化
  //   this.myChart = ECharts.init(this.$refs.myChart)
  //   //  this.myChart就是图表对象
  //   this.myChart.setOption({
  //     xAxis: {
  //       type: 'category',
  //       data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  //     },
  //     yAxis: {
  //       type: 'value'
  //     },
  //     series: [{
  //       data: [820, 932, 901, 934, 1290, 1330, 1320],
  //       type: 'line'
  //     }]
  //   })
  // },
  data () {
    return {
      list: [
        'http://img0.imgtn.bdimg.com/it/u=255540472,3722890280&fm=26&gp=0.jpg',
        'http://img5.imgtn.bdimg.com/it/u=3695192305,4134652568&fm=26&gp=0.jpg',
        'http://img1.imgtn.bdimg.com/it/u=3176354499,961574452&fm=26&gp=0.jpg',
        'http://himg2.huanqiu.com/attachment2010/2015/0216/20150216085502836.jpg'
      ]
    }
  }
}
</script>

<style lang="less" >
.second-home {
  height: calc(100vh - 60px);
  background-size: cover;
  background-image: url("http://pic1.win4000.com/wallpaper/8/589a8925a691e.jpg");
  // .eharts {
  //   width: 600px;
  //   height: 400px;
  //   // background-color: row;
  // }
}
</style>
