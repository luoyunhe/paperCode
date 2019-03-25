import Vue from 'vue'
import Router from 'vue-router'
import TakePhoto from '@/components/TakePhoto'
import PhotoSelector from '@/components/PhotoSelector'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Home from '@/components/Home'
import Query from '@/components/Query'
import Setting from '@/components/Setting'
import Pcquery from '@/components/Pcquery'
import Pclogin from '@/components/Pclogin'
import Pcregister from '@/components/Pcregister'
import Pchome from '@/components/Pchome'
import Pcrecord from '@/components/Pcrecord'
import Pcsetting from '@/components/Pcsetting'
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
      path: '/pclogin',
      name: 'Pclogin',
      component: Pclogin
    },
    {
      path: '/pcregister',
      name: 'Pcregister',
      component: Pcregister
    },
    {
      path: '/pchome',
      name: 'Pchome',
      component: Pchome,
      children: [
        {
          path: 'pcrecord',
          component: Pcrecord
        },
        {
          path: 'pcquery',
          component: Pcquery
        },
        {
          path: 'pcsetting',
          component: Pcsetting
        }
      ]
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
