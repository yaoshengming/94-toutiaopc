import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/permission'// 引入权限模块
import ElementUI from 'element-ui'// 引入模块
import axios from '@/utils/request'// 引入封装的requst.js
import Components from '@/components'// 简写引入components/index.js
import 'element-ui/lib/theme-chalk/index.css'// 引入样式
import '@/styles/index.less'// 引入样式
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Components)// 注册开发的自定义组件

Vue.prototype.$axios = axios// 将axios赋值给Vue对象得原型属性

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
