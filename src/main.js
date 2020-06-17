import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router'

import clientExample from './clientExample/clientExample';
import web3Modal from './web3Modal/web3Modal';
import home from './home/home';

Vue.use(VueRouter)
Vue.config.productionTip = false;

const routes = [
  { path: '/home', component: home },
  { path: '/foo', component: clientExample },
  { path: '/bar', component: web3Modal }
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
  routes // short for `routes: routes`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
