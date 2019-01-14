import Vue from 'vue'
import Router from 'vue-router'
import TakePhoto from '@/components/TakePhoto'
import PhotoSelector from '@/components/PhotoSelector'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Home from '@/components/Home'
import Query from '@/components/Query'
import Setting from '@/components/Setting'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/camera',
      name: 'Camera',
      component: PhotoSelector
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      children: [
        {
          path: 'record',
          component: TakePhoto
        },
        {
          path: 'query',
          component: Query
        },
        {
          path: 'setting',
          component: Setting
        }
      ]
    }
  ]
})
