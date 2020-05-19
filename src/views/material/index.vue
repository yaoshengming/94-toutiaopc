<template>
  <el-card>
    <!-- 素材管理模块 -->
    <!-- 放置面包屑 -->
    <bread-crumb slot="header">
      <!-- 具名插槽 -->
      <template slot="title">素材管理</template>
    </bread-crumb>
    <!-- 上传素材模块 -->
    <!-- 放置布局组件el-row -->
    <el-row type="flex" justify="end">
      <!-- 放置上传组件el-upload -->
      <!-- el-upload 必须有action 否则报错 -->
      <el-upload action :http-request="uploadImg">
        <el-button size="small" type="primary">上传素材</el-button>
        <!-- 传入一个内容 点击内容就会传出上传文件框 -->
      </el-upload>
    </el-row>
    <!-- 放置标签页 v-model所绑定的值 就是当前所激活的页签-->
    <!-- @tab-click  是切换tab页签时 进行事件监听 element-ui-->
    <el-tabs v-model="activeName" @tab-click="changeTab">
      <!-- 放置标签 label表示标签显示的名称 name代表页签的选中的值-->
      <el-tab-pane label="全部素材" name="all">
        <!-- 内容 循环生成页面结构 -->
        <div class="img-list">
          <!-- 采用v-for对list数据进行循环 -->
          <el-card class="img-card" v-for="(item,index) in list" :key="item.id">
            <!-- 放置图片 并且赋值 图片地址-->
            <!-- @click="dialogVisble=true"注册点击事件 走马灯  点击图片显示大图效果 -->
            <img :src="item.url" @click="selectImg(index)" >
            <!-- 操作栏 可以flex布局-->
            <el-row class="operate" type="flex" align="middle" justify="space-around">
              <i
                class="el-icon-star-on"
                @click="collectOr(item)"
                :style="{color:item.is_collected ? 'red' : 'black'}"
              ></i>
              <i class="el-icon-delete-solid" @click="delMaterial(item)"></i>
            </el-row>
          </el-card>
        </div>
      </el-tab-pane>
      <el-tab-pane label="收藏素材" name="collect">
        <!-- 内容 -->
        <!-- 内容 循环生成页面结构 -->
        <div class="img-list">
          <!-- 采用v-for对list数据进行循环 -->
          <el-card class="img-card" v-for="(item,index) in list" :key="item.id">
            <!-- 放置图片 并且赋值 图片地址-->
            <!-- @click="dialogVisble=true"注册点击事件 走马灯  点击图片显示大图效果 -->
            <img :src="item.url"  @click="selectImg(index)" >
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 放置一个公共的分页组件 -->
    <el-row type="flex" justify="center" style="height:80px" align="middle">
      <!-- 分页组件 -->
      <el-pagination
        background
        :total="page.total"
        :current-Page="page.currentPage"
        :page-size="page.pageSize"
        layout="prev,pager,next"
      >
        <!-- prev 上页 pager页码 next下一页 -->
      </el-pagination>
    </el-row>
    <!-- 走马灯效果 点击小图变大图 -->
    <!-- 放置一个el-dialog组件 通过visible属性进行true false设置-->
    <!-- close控制el-dialog走马灯的关闭按钮   @后面可以跟简单的逻辑 @事件名="属性 = 值"-->
    <el-dialog @opened="openEnd" :visible="dialogVisible" @close="dialogVisible = false">
      <!-- 放置一个element-ui走马灯组件<el-carousel> 属性indicator-position="outside" height="" -->
      <el-carousel ref="myCarousel" indicator-position="outside" height="400px">
        <!-- 放置幻灯片循环项el-carousel-item 根据当前页list循环 -->
        <el-carousel-item v-for="(item,index) in list" :key="item.id">
          <!-- 在这里放置图片 -->
          <img :src="item.url"  @click="selectImg(index)" style="width:100%;height:100%" >
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      activeName: 'all', // 当前激活的页签 默认选中素材
      list: [], // 全部素材的数据 接收全部素材
      // 分页信息
      page: {
        total: 0, // 总条数
        currentPage: 1, // 当前页码
        pageSize: 10 // 每页多少条
      },
      dialogVisible: false, // 控制走马灯显示或隐藏
      clickIndex: -1 // 点击的索引 为了点击哪个图片就是哪个图片  点击图片变大图  走马灯效果
    }
  },
  methods: {
    // 此方法是解决图片懒加载（点击图片变大图  走马灯效果）
    openEnd () {
      // 这个时候已经打开结束 ref已经有值 可以通过ref进行设置了
      this.$refs.myCarousel.setActiveItem(this.clickIndex) // 尝试通过这种方式设置index
    },
    // 为了点击哪个图片就是哪个图片  点击图片变大图  走马灯效果 定义一个方法 点击图片时调用
    selectImg (index) {
      this.clickIndex = index // 将索引赋值
      this.dialogVisible = true // 打开索引
      // 索引记录了 需要调用组件实例的方法setActiveItem,这个时候需要用到ref(获取组件实例)=>el-carousel中写ref 回到现在的代码
      // this.$refs.myCarousel.setActiveItem(index)// 尝试通过这种方式设置index 得到的结果就是第一次不行 剩下却可以 因为</el-dialog>懒加载
      // 用opened方法解决elemnt-ui 1.el-dialog中注册@opened 绑定一个方法openEnd 将此代码放入该方法中
    },
    // 收藏素材
    collectOr (row) {
      this.$axios({
        url: `/user/images/${row.id}`,
        method: 'put', //
        data: {
          collect: !row.is_collected
          // true  or flase 取反 因为收藏=>取消收藏 取消收藏=>收藏
        }
      })
        .then(() => {
          // 如果成功  我们应该重新获取数据
          this.getMaterial()
        })
        .catch(() => {
          this.$message.error('操作失败')
        })
    },
    // 删除素材
    delMaterial (row) {
      // 删除之前询问
      this.$confirm('您确定要删除该图片吗？', '提示').then(() => {
        this.$axios({
          url: `/user/images/${row.id}`,
          method: 'delete', //
          data: {
            collect: !row.is_collected
            // true  or flase 取反 因为收藏=>取消收藏 取消收藏=>收藏
          }
        })
          .then(() => {
            // 如果成功  我们应该重新获取数据
            this.getMaterial()
          })
          .catch(() => {
            this.$message.error('操作失败')
          })
      })
    },
    // 分页部分
    changPage (newPage) {
      // 传入一个新页
      this.page.currentPage = newPage // 将新页码赋值给页码数据
      this.getMaterial() // 获取数据
    },
    // 上传素材部分
    // 定义一个上传组件的方法
    uploadImg (params) {
      // params.file就是需要上传的图片文件
      // 接口参数类型要求是formData
      const data = new FormData() // 实例化一个formData
      data.append('image', params.file) // 加入文件参数
      // 开始发送上传请求
      this.$axios({
        url: '/user/images',
        method: 'post', // 上传或新增一般都是post类型
        data // es6简写 data:data
      })
        .then(() => {
          // 如果成功  我们应该重新获取数据
          this.getMaterial()
        })
        .catch(() => {
          this.$message.error('上传素材失败')
        })
    },
    // 素材部分
    // 获取素材数据
    getMaterial () {
      this.$axios({
        url: '/user/images', // 请求地址
        params: {
          collect: this.activeName === 'collect', // 变逻辑  变成两个方法都可以采用的方式
          page: this.page.currentPage, // 取页码变量中的值 页码变量一遍 获取数据跟着变
          per_page: this.page.pageSize // 获取每页数量
        }, // get参数 也就是query参数
        data: {} // data参数 放的是body参数++
      }).then(result => {
        this.list = result.data.results
        // 将总条数赋值给total变量
        this.page.total = result.data.total_count // 总数包括全部素材的总数和收藏素材的总数 总数跟随当前页签变化而变化
      })
    },
    changeTab () {
      // 切换页签事件
      this.page.currentPage = 1 // 将页码重置为第一页 因为分类变了 数据变了
      // 在切换事件中
      // 可以根据当前acticeName来决定是获取哪个方面的数据
      // activeName === 'all'获取所有素材 activeName === 'collect' 获取收藏素材
      this.getMaterial() // 重复代码  采用调用方法 改变上面getMaterial ()中collect原本写死的值
    }
  },
  created () {
    // 实例化之后 调用获取素材数据
    this.getMaterial() // 获取素材数据
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
      left: 0;
      bottom: 0;
      width: 100%;
      background: #f4f5f6;
      height: 30px;
      i {
        font-size: 20px;
      }
    }
  }
}
</style>
