import events from 'events';
events.EventEmitter.defaultMaxListeners = 20; // 设置监听器数量
import { defineConfig } from 'vite';
import path from 'path';
export default defineConfig({
  root: './',
  base: '/screen',
  build: {
    outDir: 'screen',
    rollupOptions: {
      input: {
        main: 'index.html',
        anotherPage: 'demo.html', // 如果有多个入口页面
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 配置 @ 指向 src 文件夹
    },
  },
});
