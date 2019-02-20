import Vue from 'vue'
import Router from 'vue-router'
import {Message} from 'element-ui'
import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import Users from '@/components/users.vue'
import Rights from '@/components/rights.vue'
import Roles from '@/components/roles.vue'

import Goods from '@/components/goods.vue'
import Goodsadd from '@/components/goodsadd.vue'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          name: 'users',
          path: '/users',
          component: Users
        },
        {
          name: 'rights',
          path: '/rights',
          component: Rights
        },
        {
          name: 'roles',
          path: '/roles',
          component: Roles
        },
        {
          name:'goods',
          path:'/goods',
          component:Goods
        },
        {
          name:'goodsadd',
          path:'/goodsadd',
          component:Goodsadd
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})
// 路由守卫

router.beforeEach((to, from, next) => {
  // console.log('路由守卫')
  if (to.name === 'login') {
       next()
  } else {
    const token = localStorage.getItem("token");
    // console.log(token);
    
    if (!token) {
      // 说明没有token 改标识
      router.push({
        name: 'login',
        })
      Message.warning('请先登录')
      return
    }
    next()
  }
  // console.log(to)
  // console.log(from);
  next()
})
export default router