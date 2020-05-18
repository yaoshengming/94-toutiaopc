// 封装请求工具 requestAnimationFrame.js
// 对于axios的二次封装
// 配置拦截器  以及其他
import axios from 'axios'
import router from '@/router'// 路由实例对象
import JSONBig from 'json-bigint'// 引入第三方处理大数字的包
// 拦截器及其他组件
// 配置axios的baseURL  公共的请求头地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0'
// 对axios的返回数据进行自定义处理 用json-bigint代替原来的json
// transformResponse中要返回处理结果
axios.defaults.transformResponse = [function (data) {
  // const result = JSON.parse(data)
  // return result 用json-bigint的转化来做
  // const result = JSONBig.parse(data)
  // // debugger
  // return result
  return data ? JSONBig.parse(data) : {}
}]
// 请求拦截器的开发
axios.interceptors.request.use(function (config) {
  // 成功时执行 第一个参数 会有一个config config就是所有的axios的请求信息
  // 在第一个函数中 需要将配置进行返回 返回的配置 会作为请求参数进行请求
  // 在返回之前 就是我们统一注入token的最佳时间
  // const token = localStorage.getItem('urse-token')// 从缓存中取token
  // config.headers.Authorization = `Bearer ${token}`// 统一注入token
  // debugger
  const token = localStorage.getItem('urse-token')
  config.headers.Authorization = `Bearer ${token}`
  return config
}, function (error) {
  // 失败时 会有一个错误 直接reject错误即可
  // 失败时执行第二个 axios是一个支持promise 如果失败 我们应该直接reject reject会直接进入到axios的catch中
  return Promise.reject(error)
})
// 响应拦截器的开发
axios.interceptors.response.use(function (response) {
  // 回调函数第一个参数 是响应体
  // 在拦截器中 需要将数据返回  将数据进行解构
  return response.data ? response.data : {} // 有的接口 没有任何的响应数据
  // 成功的时候执行
}, function (error) {
  // 失败的时候执行 error是错误对象 里面包含错误的状态码 和响应信息
  // 401状态码 表示用户认证失败 用户身份不对
  // 401出现的时候 表示拿错token token过期 没拿 名不对 格式不对……
  // 之前的导航守卫 校验token有没有 检查了钥匙有没有
  // 方法一粗暴换钥匙：回登录页 重来 回登录页之前 应该把旧钥匙清楚 项目二温柔换钥匙
  // debugger
  // console.log(error)
  if (error.response.status === 401) {
    localStorage.removeItem('urse-token')// 删除钥匙
    router.push('./login')// 直接导入路由实例对象 使用跳转方式 相当于组件中this.$router
    // 跳转登录页 不能用this.$router this不是组件实例
  }
  // 进行错误处理
  return Promise.reject(error)// 所有的axios调用 依然可以在catch中得到错误
})
export default axios
