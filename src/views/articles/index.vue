<template>
  <el-card class="articles">
    <bread-crumb slot="header">
      <template slot="title">文章列表</template>
    </bread-crumb>
    <!-- 搜索工具栏 筛选 -->
    <!-- 表单容器 -->
    <el-form style="padding-left:50px">
      <el-form-item label="文章状态">
        <!-- 放置单选框组 -->
        <!-- // 当选择一个频道及审核状态时 获取的数据应该是叠加数据 用事件监听方式 element-ui中对单选框监听@change -->
        <!-- <el-radio-group v-model="searchForm.status" 监听data中的数据变化第一种方法（文章状态 频道 日期 数据进行整合）@change="changeCondition"> -->
        <el-radio-group v-model="searchForm.status">
          <!-- 单选框选项label 表示该选项对应的值 -->
          <!-- :label的意思是后面值不会加引号 -->
          <!-- 文章状态，0-草稿，1-待审核，2-审核通过，3-审核失败，不传为全部 / 先将 5 定义成 全部 -->
          <el-radio :label="5">全部</el-radio>
          <el-radio :label="0">草稿</el-radio>
          <el-radio :label="1">待审核</el-radio>
          <el-radio :label="2">审核通过</el-radio>
          <el-radio :label="3">审核失败</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="频道类型">
        <!-- 选择器 -->
        <!-- 与文章状态一致  都有change 直接 @change="changeCondition" -->
        <!-- <el-select placeholder="请选择频道" v-model="searchForm.channel_id" 监听data中的数据变化第一种方法（文章状态 频道 日期 数据进行整合）@change="changeCondition"> -->
        <el-select placeholder="请选择频道" v-model="searchForm.channel_id">
          <!-- 下拉选项 应该通过接口获取数据-->
          <!-- el-option是下来的选项 label是显示值 value是绑定的值 -->
          <el-option v-for="item in channels" :key="item.id" :value="item.id" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期范围">
        <!-- 日期范围选择组件 要设置type属性为daterange-->
        <!-- 先采用插值表达式{{searchForm.dateRange}}查看 发现日期的显示值和存储值的结构不一致 使用elemengt-ui中value-format指定绑定值的格式 -->
        <!-- 与文章状态一致  都有change  监听data中的数据变化第一种方法（文章状态 频道 日期 数据进行整合）直接@change="changeCondition" -->
        <!-- <el-date-picker--
          type="daterange"
          value-format="yyyy-MM-dd"
          v-model="searchForm.dateRange"
          @change="changeCondition"
        ></el-date-picker-->
        <el-date-picker type="daterange" value-format="yyyy-MM-dd" v-model="searchForm.dateRange"></el-date-picker>
      </el-form-item>
    </el-form>
    <!-- 内容列表 文章主体结构 -->
    <el-row class="total" type="flex" align="middle">
      <span>共找到1000条符合条件的内容</span>
    </el-row>
    <!-- 内容列表 文章列表内容 -->
    <div class="article-item" v-for="item  in list" :key="item.id.toString()">
      <!-- 左侧内容 -->
      <div class="left">
        <!-- 设置文章的封面信息 有的数组有值 有的没值 默认值-->
        <!-- 脚手架项目 写的源代码 都会被编译成真实的运行代码 进行运行 目录和名称都会变化
          如果你给一个img标签 一个固定的地址 地址所对应的文件 会被拷贝到一个对应的位置使用
          但是如果你没有给图片一个固定地址 而是采用了判断或者三元写法 这个时候文件不会被拷贝及使用
          解决：在data中定义一个变量（defaultImg） 用require()方式将图片转化成变量 这个时候就可以使用了
        -->
        <img :src=" item.cover.images.length ? item.cover.images[0] : defaultImg" />
        <div class="info">
          <span>{{item.title}}</span>
          <!-- 过滤器 文章状态 0-草稿，1-待审核，2-审核通过，3-审核失败，4-已删除 -->
          <!-- 第一个过滤器是处理显示文本 第二个是处理标签类型 -->
          <el-tag :type="item.status | filterType" class="tag">{{ item.status | filterStatus }}</el-tag>
          <span class="date">{{item.pubdate}}</span>
        </div>
      </div>
      <!-- 右侧内容 -->
      <div class="right">
        <!-- <span @click="toPublish"
        文章修改 跳转到对应文章的id>
          动态路由传参  toString防止大数字-->
          <span @click="$router.push(`/home/publish/${item.id.toString()}`)" >
          <i class="el-icon-edit"></i> 修改
        </span>
        <span @click=" del( item.id.toString())">
          <!-- 删除需要传递删除的参数id id有可能是大数字类型 所以to toString -->
          <i class="el-icon-delete"></i> 删除
        </span>
      </div>
    </div>
    <!-- 放置分页组件 -->
    <el-row type="flex" justify="center" style="height:80px" align="middle">
      <!-- 分页组件 -->
      <el-pagination
        :current-page="page.currentPage"
        :page-size="page.pageSize"
        :total="page.total"
        @current-change="changePage"
        background
        layout="prev,pager,next"
      ></el-pagination>
    </el-row>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      // 分页
      page: {
        currentPage: 1, // 当前页码
        pageSize: 10, // 接口要求每页10-50条之间
        total: 0 // 总数
      },
      //   定义一个表单数据对象
      searchForm: {
        // 数据
        // <!-- 文章状态，0-草稿，1-待审核，2-审核通过，3-审核失败，不传为全部 / 先将 5 定义成 全部 -->
        // 传值的时候如果是5 就不传
        status: 5, // 文章状态默认全部
        channel_id: null, // 表示没有任何频道
        dateRange: []
      },
      channels: [], // 专门来接收频道的数据
      list: [], // 专门来接收文章的数据
      // 地址对应的文件变成了变量 在编译的时候被拷贝到编译的位置
      defaultImg: require('../../assets/img/v2-deff985cfcb7690bc71fdf8676438146_hd.jpg')
    }
  },
  // 监听data中的数据变化（文章状态 频道 日期 数据进行整合） 第一种@change="changeCondition"  第二种解决方案  watch监听对象的深度检测方案
  watch: {
    searchForm: {
      deep: true, // 固定写法 表示 会深度检测searchForm中的数据变化
      // handler也是一个固定写法 一旦数据发生任何变化 就会触发 更新
      handler () {
        //  统一调用改变条件的 方法
        this.page.currentPage = 1 // 分页 只要条件变化 就变成第一页
        this.changeCondition() // this 指向当前组件实例
      }
    }
  },
  // 过滤器专门处理显示格式
  filters: {
    // 第一个参数value
    // <!-- 文章状态 0-草稿，1-待审核，2-审核通过，3-审核失败，4-已删除 -->
    filterStatus (value) {
      switch (value) {
        case 0:
          return '草稿'
        case 1:
          return '待审核'
        case 2:
          return '已发表'
        case 3:
          return '审核失败'
      }
    }, // 过滤器 除了用在插值表达式中 还可以用v-bind的表达式中
    filterType (value) {
      // 根据当前状态的值 显示不同类型的tag 标签
      switch (value) {
        case 0:
          return 'warning' // 草稿的时候是警告 element-ui
        case 1:
          return 'info' // 待审核
        case 2:
          return '' // 已发表
        case 3:
          return 'danger' // 审核失败
      }
    }
  },
  methods: {
    // 修改文章跳转到文章页面
    toPublish () {
      // this.$router.push('/home/publish')
    },
    // 删除素材
    del (id) {
      // 删除之前提问
      this.$confirm('您确定删除此条数据？', '提示').then(() => {
        this.$axios({
          method: 'delete',
          url: `/articles/${id}`
        }).then(() => {
          // 删除成功 成功获取数据
          // 应该带着条件去获取
          this.changeCondition()
        }).catch(() => {
          this.$message.error('删除文章失败')
        })
      })
    },
    // 分页 改变页码事件
    changePage (newPage) {
      // 现将最新页码给到当前页码
      this.page.currentPage = newPage // 最新页码
      // 切换页码也需要带条件去翻页 组装条件
      this.changeCondition() // 直接调用改变事件的方法
    },
    // 当选择一个频道及审核状态时 获取的数据应该是叠加数据 用事件监听方式 element-ui中对单选框监听change
    changeCondition () {
      // alert(this.searchForm.status)当触发此方法时 表单数据已经变成最新的了
      // 组装条件params 即文章状态 频道 日期
      const params = {
        page: this.page.currentPage, // 如果变化条件 应该回到第一页
        per_page: this.page.pageSize,
        status: this.searchForm.status === 5 ? null : this.searchForm.status, // 当文章状态为5时 显示全部文章 不传数据=null
        // status文章状态 channel_id频道id，不传为全部   begin_pubdate起始时间 end_pubdate截止时间都是接口文档中的参数
        channel_id: this.searchForm.channel_id, // 就是表单数据
        // this.searchForm.dateRange &&判断 至少不为空 解决关闭日期时内容不变化的情况
        begin_pubdate:
          this.searchForm.dateRange && this.searchForm.dateRange.length
            ? this.searchForm.dateRange[0]
            : null,
        end_pubdate:
          this.searchForm.dateRange && this.searchForm.dateRange.length > 1
            ? this.searchForm.dateRange[1]
            : null
      }
      // 通过接口传入
      this.$axios({
        url: '/articles',
        params
      }).then(result => {
        this.list = result.data.results
      })
      console.log(params)
    },
    //   获取频道数据
    getClannels () {
      this.$axios({
        url: '/channels'
      }).then(result => {
        // 获取频道接口返回的数据
        this.channels = result.data.channels
      })
    },
    // 获取文章列表
    getArticles () {
      this.$axios({
        url: '/articles'
      }).then(result => {
        this.list = result.data.results
        // 分页 将总数赋值给total
        this.page.total = result.data.total_count // 文章总数
      })
    }
  },
  created () {
    this.getClannels()
    this.getArticles() // 手动调用文章数据
  }
}
</script>

<style lang='less' scoped >
.articles {
  .total {
    height: 60px;
    border-bottom: 1px dashed #ccc;
  }
  // 对文章循环项进行样式的编写
  .article-item {
    display: flex;
    justify-content: space-between;
    padding: 20px 0;
    border-bottom: 1px solid #ccc;
    .left {
      display: flex;
      img {
        width: 180px;
        height: 100px;
        border-radius: 4px;
      }
      .info {
        display: flex;
        flex-direction: column;
        height: 100px;
        justify-content: space-around;
        margin-left: 10px;
        .date {
          color: #999;
          font-size: 12px;
        }
        .tag {
          width: 60px;
          text-align: center;
        }
      }
    }
    .right {
      span {
        font-size: 12px;
        margin-right: 8px;
        cursor: pointer;
        user-select: none;
      }
    }
  }
}
</style>
