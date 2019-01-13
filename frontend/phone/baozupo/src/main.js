// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'
import { Toast } from 'mint-ui'

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.$toast = Toast

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    const token = localStorage.getItem('token')
    const tokenExp = localStorage.getItem('token_exp')
    const nowTime = new Date().getTime()
    console.log(nowTime - tokenExp)
    if (token && nowTime - tokenExp <= 1000 * 60 * 60 * 2) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})
// axios 请求拦截器处理请求数据
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  config.headers.common['Authorization'] = 'Bearer ' + token
  return config
})
// axios 响应拦截器处理响应数据
axios.interceptors.response.use(res => {
  return res.data
}, err => {
  return Promise.reject(err)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
