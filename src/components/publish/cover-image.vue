<template>
  <div class="cover-image">
    <!-- 封面组件 -->
    <!-- openDialog(index)的index解决三图模式下 对应图片问题 -->
    <div
      @click="openDialog(index)"
      v-for="(item,index) in list"
      :key="index"
      class="cover-image-item"
    >
      <!-- 图片地址应该等于item -->
      <!-- 一开始item是一个空字符串 因为此时还咩有选择图片 此时应该根据item是否有值 来决定显示默认图片还是item-->
      <!-- item如果没有值 就显示默认图片 -->
      <!-- img如果不是固定地址的话 图片应该先转化成变量 -->
      <img :src="item ? item : defaultImg" alt srcset />
    </div>
    <!-- 采用element-ui的弹层组件 -->
    <el-dialog :visible="dialogVisible" @close="dialogVisible=false">
      <!-- 再次封装一个选择图片的组件 -->
      <!-- // 点击图片时把所对应素材库图片选中 @selectOneImg在select-image中-->
      <select-image @selectOneImg="rectiveImg"></select-image>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['list'], // 接收传递的参数
  data () {
    return {
      defaultImg: require('../../assets/img/pic_bg.png'), // <!-- img如果不是固定地址的话 图片应该先转化成变量 -->
      dialogVisible: false, // 显示变量 控制弹层显示或隐藏
      selectIndex: -1 // 用来记录当前点击了哪个索引（解决三图模式下 对应封面图片问题）
    }
  },
  methods: {
    //   点击封面图片时弹出一个层
    openDialog (index) {
      this.dialogVisible = true // 显示弹层
      this.selectIndex = index // openDialog (index)中的index 记录点击了哪一张图片
    },
    // 点击图片时把所对应素材库图片选中 接收传递的地址@selectOneImg="rectiveImg"
    rectiveImg (url) {
      // 再次传递数据给父组件
      // 二次传递时  需要把之前记录要更改的索引this.selectIndex传出去（解决三图模式下 对应封面图片问题）
      this.$emit('selectTwoImg', url, this.selectIndex)
      // 关闭弹层
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.cover-image {
  display: flex;
  margin: 20px 100px;
  .cover-image-item {
    border: 1px solid #ccc;
    width: 250px;
    height: 250px;
    padding: 20px;
    img {
     margin-left: -5px;
     margin-top:-5px;
     width: 220px;
     height: 220px;
    }
  }
}
</style>
