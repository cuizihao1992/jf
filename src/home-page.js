import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';

// 导入子组件
import '@/modules/system-home/index.js';
import '@/modules/device-control/index.js';
import '@/modules/task-management/index.js';
import '@/modules/device-management/index.js';
import '@/modules/user-management/index.js';
import '@/modules/log-management/index.js';
import '@/components/login-page.js'; // 引入登录页面组件

class HomePage extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
      background-color: #f5f7fa;
      min-height: 100vh;
    }

    .content {
      border: 0;
      padding: 0;
      margin: 0;
    }

    /* 顶部栏 */
    .header {
      background-image: url('/images/header-bg.png');
      background-size: cover;
      background-position: center;
      text-align: center;
      opacity: 1;
      font-size: 45px;
      font-weight: 400;
      letter-spacing: 0px;
      line-height: 65.16px;
      color: rgba(255, 255, 255, 1);
      vertical-align: top;
    }

    /* 导航栏 */
    .nav {
      position: relative;
      top: -25px;
      display: flex;
      justify-content: space-between; /* 两边分布 */
      padding: 10px 20px;
    }

    /* 左右两个分组 */
    .nav-left,
    .nav-right {
      display: flex;
      gap: 10px; /* 按钮之间的间隔 */
    }

    .nav a {
      text-decoration: none;
      color: #ffffff;
      padding: 10px 20px;
      font-size: 18px;
      background-image: url('/images/button-bg.png');
      background-size: cover; /* 确保背景图片覆盖按钮 */
      background-repeat: no-repeat;
      background-position: center;
      border-radius: 5px;
      cursor: pointer;
      transition:
        background-color 0.3s,
        color 0.3s;
    }

    .nav a:hover {
      color: #ffeb3b;
    }

    .nav a.active {
      color: #ffeb3b;
    }
  `;

  firstUpdated() {
    const router = new Router(this.shadowRoot.querySelector('.content'));
    router.setRoutes([
      { path: '/', component: 'system-home' },
      { path: '/device-control', component: 'device-control' },
      { path: '/task-management', component: 'task-management' },
      { path: '/device-management', component: 'device-management' },
      { path: '/user-management', component: 'user-management' },
      { path: '/log-management', component: 'log-management' },
      { path: '/login', component: 'login-page' }, // 添加登录页路由
      { path: '(.*)', redirect: '/' }, // 默认重定向到首页
    ]);

    window.addEventListener('popstate', () => {
      this.requestUpdate(); // 当 URL 变化时更新
    });
  }

  // 根据当前路径判断是否为登录页面
  isLoginPage() {
    return window.location.pathname === '/login';
  }

  // 根据当前路径获取激活的导航项
  isActive(path) {
    return window.location.pathname === path ? 'active' : '';
  }

  render() {
    return html`
      ${!this.isLoginPage()
        ? html`
            <!-- <div class="header">自动角反射器可视化与控制系统</div> -->
            <div class="header">测试</div>

            <div class="nav">
              <!-- 左侧按钮 -->
              <div class="nav-left">
                <a href="/" class="${this.isActive('/')}">系统首页</a>
                <a
                  href="/device-control"
                  class="${this.isActive('/device-control')}"
                  >设备控制</a
                >
                <a
                  href="/task-management"
                  class="${this.isActive('/task-management')}"
                  >任务管理</a
                >
              </div>

              <!-- 右侧按钮 -->
              <div class="nav-right">
                <a
                  href="/device-management"
                  class="${this.isActive('/device-management')}"
                  >设备管理</a
                >
                <a
                  href="/user-management"
                  class="${this.isActive('/user-management')}"
                  >用户管理</a
                >
                <a
                  href="/log-management"
                  class="${this.isActive('/log-management')}"
                  >日志管理</a
                >
              </div>
            </div>
          `
        : ''}
      <div class="content"></div>
    `;
  }
}

customElements.define('home-page', HomePage);
