// 专门处理路由权限问题
import router from '@/router'
// 注册全局前置守卫
// 回调函数会在路由发生改变之前执行
router.beforeEach(function (to, from, next) {
//   next()  next必须执行
  // 首先判断 需要拦截哪些页面 如果页面的地址以/home为开头 就需要进行token判断
  // 判断你要判断的页面是不是以/home为开头
  if (to.path.startsWith('/home')) {
    // 表示你要去主页相关页面 看有没有token 没有就直接到登录页
    const token = window.localStorage.getItem('urse-token')
    if (token) {
      next()// 放过
    } else {
      next('/login')// 回登录页  拿token
    }
  } else {
    // 如果不是去主页相关
    next()// 直接放过
  }
})
