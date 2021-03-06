import Vue from 'vue'
import App from './App.vue'

import Axios from 'axios'
import Router from 'vue-router'
import Vuex from './js/vuex'
import Cookies from 'vue-cookies'

import Cupcake from './pages/cupcakePage'
import Orders from './pages/ordersPage'
import Add from './pages/addCupcakePage'

import Input from './components/MyInput'

Vue.component('Input', Input)

Vue.config.productionTip = false

const ax = Axios;
ax.defaults.baseURL = 'http://localhost:3000'

Vue.prototype.$axios = ax

Vue.use(Router)
Vue.use(Cookies)
Vue.$cookies.config('6h')

const router = new Router({
  routes: [
    { path: '/', component: Cupcake, meta: { title: 'Cup Cakes' } },
    { path: '/Orders', component: Orders, meta: { title: 'All Orders' } },
    { path: '/New', component: Add, meta: { title: 'Add Cupcake' } }
  ],
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title

  next()
})

new Vue({
  render: h => h(App),
  router,
  store: Vuex
}).$mount('#app')
