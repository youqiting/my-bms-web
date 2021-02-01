import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import api from './http/index' // 请求封装
import components from './components/index'; //注册自定义组件
import * as util from './utils/index';

import './plugins/element.js' // element按需引入
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '@/styles/index.scss' // global css

import '@/permission' // permission control

Vue.use(api)
Vue.use(components)

Vue.prototype.$util = util
Vue.config.productionTip = false

//刷新保存状态
if (localStorage.getItem("store")) {
  store.replaceState(
      Object.assign(
          {},
          store.state,
          JSON.parse(localStorage.getItem("store"))
      )
  );
  // localStorage.removeItem("store")
}

//监听，在页面刷新时将vuex里的信息保存到localStorage 里
window.addEventListener("beforeunload", (e) => {
  localStorage.setItem("store", JSON.stringify(store.state));
  // sessionStorage.setItem("store", JSON.stringify(store.state));
});

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
