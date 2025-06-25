import ContextMenu from '@imengyu/vue3-context-menu';
import ElementPlus from 'element-plus';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { permissionDirective } from '@/directive';
import App from './App.vue';

import router from './router';
import './style/tailwindcss.css';
import './assets/styles/index.scss';
import 'element-plus/dist/index.css';
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css';
import './components/icon-font/iconfont';

if (window.logger) {
  window.logger.msg(console.log);
}

async function initApp() {
  const app = createApp(App);
  app.use(createPinia());
  app.use(router);
  app.use(ElementPlus);
  app.use(ContextMenu);
  app.directive('permission', permissionDirective);
  app.mount('#app');
}

initApp();
