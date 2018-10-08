// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import echarts from 'echarts'
import './service/http.js'
import store from './store/index'
import utils from './util/utils'
import * as Filter from './util/filter.js'
import moment from 'moment'
import { Flexbox, FlexboxItem, Group, Grid, GridItem, Tab , TabItem , Swiper, SwiperItem, VChart,XButton ,PopupPicker, VLine, VArea, VBar, VPie, VPoint, VScale, VAxis, VGuide, VTooltip, VLegend,Datetime, XTable } from 'vux'
import  { LoadingPlugin } from 'vux'


Vue.component('x-button', XButton)
Vue.component('group', Group)
Vue.component('popup-picker', PopupPicker)
Vue.component('tab', Tab)
Vue.component('tab-item', TabItem)
Vue.component('swiper', Swiper)
Vue.component('swiper-item', SwiperItem)

Vue.component('v-chart', VChart)
Vue.component('v-line', VLine)
Vue.component('v-area', VArea)
Vue.component('v-bar', VBar)
Vue.component('v-pie', VPie)
Vue.component('v-point', VPoint)
Vue.component('v-scale', VScale)
Vue.component('v-axis', VAxis)
Vue.component('v-guide', VGuide)
Vue.component('v-tooltip', VTooltip)
Vue.component('v-legend', VLegend)
Vue.component('datetime', Datetime)
Vue.component('grid', Grid)
Vue.component('grid-item', GridItem)
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts;

Vue.prototype.$utils = utils;
Vue.prototype.moment = moment;
Object.keys(Filter).forEach(key => {
  Vue.filter(key, Filter[key])
})
Vue.use(LoadingPlugin)

// 添加 Fastclick 移除移动端点击延迟
const FastClick = require('fastclick')
FastClick.attach(document.body)

Vue.component('flexbox', Flexbox)
Vue.component('flexbox-item', FlexboxItem)
Vue.component('group', Group)
Vue.component('grid', Grid)
Vue.component('grid-item', GridItem)
Vue.component('tab', Tab)
Vue.component('tab-item', TabItem)
Vue.component('swiper', Swiper)
Vue.component('swiper-item', SwiperItem)
Vue.component('v-chart', VChart)
Vue.component('x-table', XTable)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
