import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import TakePhoto from '@/components/TakePhoto'
import PhotoSelector from '@/components/PhotoSelector'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/takephoto',
      name: 'TakePhoto',
      component: TakePhoto
    },
    {
      path: '/camera',
      name: 'Camera',
      component: PhotoSelector
    }
  ]
})
