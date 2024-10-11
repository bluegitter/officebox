import Vue from 'vue';
import VueRouter from 'vue-router';

// 导入页面组件
import PdfToolList from '@/components/PdfToolList.vue';
import OcrToolList from '@/components/OcrToolList.vue';
import Home from '@/views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/pdf-tools', // 默认跳转到 PDF 工具页
    children: [
      {
        path: 'pdf-tools',
        name: 'PdfToolList',
        component: PdfToolList
      },
      {
        path: 'ocr-tools',
        name: 'OcrToolList',
        component: OcrToolList
      }
    ]
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
