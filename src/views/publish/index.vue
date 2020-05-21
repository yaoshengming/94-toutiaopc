<template>
  <el-card>
    <bread-crumb slot="header">
      <template slot="title">发布文章</template>
    </bread-crumb>
     <!-- 表单组件  标题宽度设置于 el-form组件-->
      <el-form ref='myForm' :model="publishForm"  :rules="publishRlues" style="margin-left:50px" label-width="100px">
        <el-form-item label="标题" prop="title">
          <!-- 输入框 -->
          <el-input  v-model="publishForm.title"  placeholder="请输入您的标题" style="width:60%"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <!-- 多行输入 -->
          <el-input  v-model="publishForm.content"  placeholder="请输入您的内容" type='textarea' :rows="4"></el-input>
        </el-form-item>
        <el-form-item label="封面"  prop="cover">
          <!-- 单选框组 -->
          <el-radio-group   v-model="publishForm.cover.type">
              <!-- 给el-radio加上lable属性 -->
             <el-radio :label="1">单图</el-radio>
             <el-radio :label="3">三图</el-radio>
             <el-radio :label="0">无图</el-radio>
             <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <!-- select选择器 -->
          <el-select placeholder="请选择频道" v-model="publishForm.channel_id" >
              <!-- 下拉选项v-for循环生成el-option -->
              <!-- lable 显示值 value 保存值 -->
              <el-option v-for="item in channels" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <!-- 放置两个按钮 -->
          <el-button  @click="publish(false)" type='primary'>发表</el-button>
          <el-button @click="publish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      channels: [], // 接收频道数据
      //   发布表单数据
      publishForm: {
        title: '', // 标题
        content: '', // 内容
        cover: {
          type: '0',
          images: []// 字符串数组 对应type 假如type为1 images中应该有一个值 假如为3 images应该有三个值 0 images为空
        }, // 封面 封面类型 -1:自动，0-无图，1-1张，3-3张
        channel_id: null
      }, // 文章所属频道id
      publishRlues: {
        title: [{ required: true, message: '文章标题不能为空', trigger: 'blur' },
          { min: 5, max: 30, message: '标题应该在5-30字符之间', trigger: 'blur' }],
        content: [{ required: true, message: '文章内容不能为空', trigger: 'blur' }],
        channel_id: [{ required: true, message: '频道内容不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 发表手动校验  先ref 再注册事件
    publish (draft) {
      this.$refs.myForm.validate().then(() => {
        //   调用发布接口 进入then 表示成功
        this.$axios({
          method: 'post',
          url: '/articles',
          params: { draft },
          //   params: { draft: false }, // query参数
          data: this.publishForm// 请求体body参数
        }).then(() => {
          this.$message.success('发布成功！')
          this.$router.push('/home/articles')// 发布成功跳转到文章列表
        }).catch(() => {
          this.$message.error('发布失败!')
        })
      })
    },
    // 获取频道数据
    getCannels () {
      this.$axios({
        url: '/channels'
      }).then(result => {
        this.channels = result.data.channels// 将频道数据赋值给本地数据
      })
    }
  },
  created () {
    // 调用频道数据的方法
    this.getCannels()
  }
}
</script>

<style>
</style>
