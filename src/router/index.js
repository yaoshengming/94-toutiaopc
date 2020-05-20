import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/home'
import Login from '@/views/login'
import SecondHome from '@/views/home/second_home'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'// 强制跳转到home页
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '', // 二级路由的path什么都不写 代表二级路由的默认组件
        component: SecondHome// 默认的二级路由组件
      }, {
        path: 'comment', // 地址
        component: () => import('@/views/comment')// 组件 按需加载的方式
      }, {
        path: 'material', // 素材管理地址
        component: () => import('@/views/material')// 组件 按需加载
      },
      {
        path: 'articles', // 内容管理地址
        component: () => import('@/views/articles')// 组件 按需加载
      },
      {
        path: 'publish', // 发布文章
        component: () => import('@/views/publish')
      }
    ]
    // 在一级路由的路由表下children配置二级路由表
  },
  {
    path: '/login',
    component: Login,
    name: 'login'

  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router
