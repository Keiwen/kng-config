// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import App from './App'
import router from './router'
import store from './store'
import BootstrapVue from 'bootstrap-vue'
import Icon from 'vue-awesome/components/Icon'
import 'hover.css/scss/hover.scss'
// import VueAnalytics from 'vue-analytics'
import 'vue-awesome/icons'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.component('icon', Icon)
// Vue.use(VueAnalytics, {
//   id: 'toDefine',
//   router,
//   autoTracking: {
//     exception: true
//   }
// })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
