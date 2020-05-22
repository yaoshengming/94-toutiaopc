<template>
  <!-- 上传素材 和显示素材 -->
  <el-tabs v-model="activeName">
    <el-tab-pane label="素材库" name="material">
      <!-- v-for循环遍历list数据 -->
      <div class="select-image-list">
        <el-card v-for="item in list" :key="item.id" class="img-card">
          <!-- 显示素材图片 -->
          <img @click="clickImg(item.url)" :src="item.url" alt />
        </el-card>
      </div>
      <!-- 分页 -->
      <el-row type="flex" justify="center" style="height:80px" align="middle">
        <!-- 分页组件 -->
        <el-pagination
          background
          layout="prev, pager, next"
          :total="page.total"
          :current-page="page.currentPage"
          :page-size="page.pageSize"
          @current-change="changePage "
        ></el-pagination>
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="上传素材" name="upload">
      <!-- 放置上传组件 -->
      <!-- action必须给值 不然会报错 :http-reques自定义上传素材-->
      <el-upload action class="upload-img"  :http-request="uploadImg">
        <!-- 放置一个元素 用来点击上传 -->
        <i  class="el-icon-plus" ></i>
      </el-upload>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  data () {
    return {
      activeName: 'material', // 当然激活的变量
      list: [], // 素材列表数据
      page: {
        currentPage: 1,
        pageSize: 12,
        total: 0 // 总条数
      }
    }
  },
  methods: {
    getAllImg () {
      this.$axios({
        url: '/user/images',
        params: {
          collect: false, // 查询全部素材
          page: this.page.currentPage, // 当前页码
          per_page: this.page.pageSize // 每页多少条
        }
      }).then(result => {
        this.list = result.data.results // 获取全部素材数据
        this.page.total = result.data.total_count
      })
    },
    // 对页码改变数据改变事件监听
    changePage (newPage) {
      this.page.currentPage = newPage // 赋值新页码
      this.getAllImg() // 获取数据
    },
    // 点击图片时把所对应素材库图片选中
    clickImg (url) {
      // 需要将url参数传递给上层组件
      this.$emit('selectOneImg', url)
    },
    // 上传素材
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
        .then((result) => {
          // 如果成功  接口会返回给我们一个上传成功之后的图片地址
          this.$emit('selectOneImg', result.data.url)// 将url参数传出去
        })
        .catch(() => {
          this.$message.error('上传素材失败')
        })
    }
  },
  created () {
    this.getAllImg() // 获取所有图片数据
  }
}
</script>

<style lang='less' scoped>
.select-image-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  .img-card {
    width: 150px;
    height: 150px;
    margin: 20px 0;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.upload-img{
  display: flex;
  justify-content: center;
  i{
    font-size: 20px;
    padding: 50px;
    border: 2px dashed #ccc;
    border-radius: 4px;
  }
}
</style>
