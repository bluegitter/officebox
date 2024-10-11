import Vue from 'vue';
import App from './App.vue';  // 替换为 App 组件作为主组件
import router from './router'; // 导入 router 配置

Vue.config.productionTip = false;

new Vue({
  router, // 挂载 router 实例
  render: h => h(App), // 渲染 App 组件而不是 Home
}).$mount('#app');
