import Vue from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
Vue.config.productionTip = false
Vue.use(Antd);

Vue.prototype.$isPc = function() {
  let width = document.documentElement.clientWidth || document.body.clientWidth;
  return width > 500;
};

new Vue({
  render: h => h(App),
}).$mount('#app')
