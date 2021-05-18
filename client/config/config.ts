import { defineConfig } from 'umi';
import { resolve } from "path";
import routes from './route.config';

export default defineConfig({
  links: [{ rel: 'icon', href: '/img/logo_.png' }],
  crossorigin: true,
  nodeModulesTransform: {
    type: 'none',
  },
  routes,
  layout: {
    name: '社区诊所管理系统(医生端)',
  },
  theme: {
    '@primary-color': '#666EE8',
  },
  define: {
    API_BASE: 'http://127.0.0.1:7001',
  },
  locale: {
    default: 'zh-CN',
    antd: true,
    title: false,
    // baseNavigator: true,
    // baseSeparator: '-',
  },
  //兼容浏览器版本  配置需要兼容的浏览器最低版本，会自动引入 polyfill 和做语法转换 Default: { chrome: 49, firefox: 64, safari: 10, edge: 13, ios: 10 }
  targets: {
    ie: 11,
  },
  // 别名配置
  alias: {
    "@": resolve(__dirname, "./src"),
  },
  // 代理配置(跨域处理) http://10.98.98.142:8080/
  // proxy: {
  //   '/api': {
  //     'target': 'http://10.98.101.225:8089/goods',
  //     'changeOrigin': true,
  //     'pathRewrite': { '^/api' : '' },
  //   },
  // },
});
