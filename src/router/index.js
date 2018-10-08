import Vue from 'vue'
import Router from 'vue-router'
import Charts from '@/views/charts/index'
import Index from '@/views/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
        path: '/index',
        name: 'Index',
        component: Index
    },
    {
      path: '/charts',
      name: 'Charts',
      component: Charts
    }
  ]
})
