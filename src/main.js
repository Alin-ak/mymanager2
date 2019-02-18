// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/reset.css'
import App from './App'
import router from './router'
// 导入封装好的axios插件
import HttpServer from '@/http.js'
// 使用封装好的axios

Vue.use(HttpServer)
// 导入处理日期格式的插件
import moment from 'moment'

// 导入封装的面包屑组件 注册全局组件
import CurBread from '@/components/curBread.vue'
Vue.component(CurBread.name,CurBread)
// Vue.use(axios)

Vue.use(ElementUI)
Vue.config.productionTip = false
// 注册处理日期过滤器
Vue.filter('fmtdate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
