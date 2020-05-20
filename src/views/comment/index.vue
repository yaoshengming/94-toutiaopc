<template>
  <!-- 用el-card组件做主页面 -->
  <!-- 遮罩层 v-loading是指令 是变量 属性：是变量-->
  <el-card v-loading="loading">
    <!-- 放置一个面包屑组件 slot="header"表示面包屑会作为具名插槽给card的header部分 -->
    <bread-crumb slot="header">
      <!-- slot="title"表示评论管理给面包屑的插槽 -->
      <template slot="title">评论管理</template>
    </bread-crumb>
    <!-- 表格组件 -->
    <el-table :data="list">
      <!-- 使用el-table-column作为列 -->
      <!-- prop表示显示的字段 label表示表头 -->
      <el-table-column prop="title" width="600" label="标题"></el-table-column>
      <!-- 给el-table-column一个formatter属性 用来格式化内容 -->
      <el-table-column :formatter="formatterBool" prop="comment_status" label="评论状态"></el-table-column>
      <el-table-column prop="total_comment_count" label="总评论数"></el-table-column>
      <el-table-column prop="fans_comment_count" label="粉丝评论数"></el-table-column>
      <el-table-column label="操作">
        <!-- 可以放组件 -->
        <template slot-scope="obj">
          <el-button size="small" type="text">修改</el-button>
          <!-- 根据评论状态决定是否打开还是关闭评论 作用域插槽 子组件中的数据通过插槽传出slot-scope接收 row(行数据）$index(索引）-->
          <el-button
            @click="openOr(obj.row)"
            size="small"
            type="text"
          >{{obj.row.comment_status ? "关闭" : "打开" }}评论</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row type="flex" align="middle" justify="center" style="height:80px">
      <el-pagination
        background
        layout="prev,pager,next"
        :total="page.total"
        :current-page="page.currentPage"
        :page-size="page.pageSize"
        @current-change="changePage"
      >
        <!-- @current-change element-ui监听页码改变 数据变化 -->
        <!-- 动态数据 -->
      </el-pagination>
    </el-row>
  </el-card>
</template>
<script>
export default {
  data () {
    return {
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      list: [],
      loading: false// 遮罩层数据加载效果 控制遮罩层显示或隐藏
    }
  },
  methods: {
    // 分页
    // 页码改变事件 newPage就是点击切换的最新页码
    changePage (newPage) {
      // 将最新的页码设置给page下的当前页码
      this.page.currentPage = newPage
      this.getComment() // 获取评论
    },
    // 获取评论数据
    getComment () {
      this.loading = true// 在数据显示之前打开遮罩层
      this.$axios({
        url: '/articles', // 请求地址
        params: {
          response_type: 'comment', // 此参数用来控制获取数据类型
          page: this.page.currentPage, // 查第一页
          per_page: this.page.pageSize // 查10条
        }
        // query参数应该在哪个位置传axios
        // params传get参数也就是query参数
        // data 传body参数也就是请求体参数
      }).then(result => {
        // 将返回结果中的数组给list
        this.list = result.data.results
        this.page.total = result.data.total_count // 将总数赋值
        this.loading = false// 数据请求完毕后关闭遮罩层
      })
    },
    //  定义一个格式化的函数
    formatterBool (row, column, cellValue, index) {
      //  row 代表当前的一行数据
      // column 代表当前的列信息
      // cellValue 代表当前单元格的值
      // index 代表当前的索引
      // 该函数需要返回一个值 用来显示
      return cellValue ? '正常' : '关闭'
    },
    // 打开或关闭
    openOr (row) {
      const mess = row.comment_status ? '关闭' : '打开'
      // 点击成功后直接进入then 点击取消会进入到catch
      this.$confirm(`是否确定${mess}评论`, '提示').then(() => {
        // 调用打开或关闭接口
        this.$axios({
          url: '/comments/status',
          // params是query参数
          method: 'put',
          params: {
            article_id: row.id.toString() // 要求参数文章id 大数字处理
            // 前端传字符串到后端 只要和原数字一致 后端会自动将字符串转成大数字
            // 只要保证id和传过来的id一致就行
          },
          data: {
            // body参数
            allow_comment: !row.comment_status // 打开还是关闭 此状态和评论状态相反
          }
        })
          .then(() => {
            // 成功提示信息
            this.$message.success(`${mess}评论成功`)
            this.getComment() // 重新获取数据
          })
          .catch(() => {
            // 失败提示信息
            this.$message.error(`${mess}评论失败`)
          })
      })
    }
  },
  created () {
    // 在钩子函数中 直接获取数据
    this.getComment()
  }
}
</script>

<style>
</style>
