import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';

// 导入子组件
import './modules/system-home.js';
import './modules/device-control/device-control.js';
import './modules/task-management.js';
import './modules/device-management.js';
import './modules/user-management.js';
import './modules/log-management.js';
import './components/login-page.js';  // 引入登录页面组件

class HomePage extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
      background-color: #f5f7fa;
      min-height: 100vh;
    }

    .content{
      border: 0;
      padding: 0;
      margin: 0;
    }

    /* 顶部栏 */
    .header {
      background-color: #3f81c1;
      color: white;
      padding: 10px;
      text-align: center;
      font-size: 24px;
    }

    /* 导航栏 */
    .nav {
      display: flex;
      justify-content: center;
      background-color: #e6edf7;
      padding: 10px;
    }

    .nav a {
      text-decoration: none;
      color: #333;
      padding: 10px 20px;
      font-size: 18px;
      background-color: #c6d9f0;
      border-radius: 5px;
      margin: 0 5px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .nav a:hover {
      background-color: #a6c4e5;
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
      { path: '/login', component: 'login-page' },  // 添加登录页路由
      { path: '(.*)', redirect: '/' } // 默认重定向到首页
    ]);

    // 监听路由变化，控制导航栏显示与否
    // router.addEventListener('location-changed', () => {
    //   this.requestUpdate();
    // });
    window.addEventListener('popstate', () => {
      this.requestUpdate(); // 当 URL 变化时更新
    });
  }

  // 根据当前路径判断是否为登录页面
  isLoginPage() {
    return window.location.pathname === '/login';
  }

  render() {
    return html`
      ${!this.isLoginPage() ? html`
        <div class="header">
          自动角反射器可视化与控制系统
        </div>
  
        <div class="nav">
          <a href="/">系统首页</a>
          <a href="/device-control">设备控制</a>
          <a href="/task-management">任务管理</a>
          <a href="/device-management">设备管理</a>
          <a href="/user-management">用户管理</a>
          <a href="/log-management">日志管理</a>
        </div>
      ` : ''}
      <div class="content"></div>
    `;
  }
}

customElements.define('home-page', HomePage);
