import events from 'events';
events.EventEmitter.defaultMaxListeners = 20;
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  // 根据模式来判断 base 和 outDir
  const isScreenMode = mode === 'screen';
  return {
    root: './',
    base: isScreenMode ? '/screen' : '/',
    build: {
      outDir: isScreenMode ? 'screen' : 'dist',
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
  };
});
