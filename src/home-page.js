import { LitElement, html, css, unsafeCSS } from 'lit';
import { Router } from '@vaadin/router';
import mapboxgl from 'mapbox-gl';

// 导入子组件
import '@/modules/system-home/index.js';
import '@/modules/device-control/index.js';
import '@/modules/task-management/index.js';
import '@/modules/device-management/index.js';
import '@/modules/user-management/index.js';
import '@/modules/log-management/index.js';
import '@/components/login-page.js'; // 引入登录页面组件
import styles from './home-page.css?inline';
class HomePage extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;
  static properties = {
    currentTime: { type: String },
    currentLocation: { type: String },
  };

  constructor() {
    super();
    this.currentTime = '';
    this.currentLocation = '北京市';
    this.updateTime();
  }

  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    setTimeout(() => this.updateTime(), 1000);
  }
  initMap() {
    // 初始化地图
    mapboxgl.accessToken =
      'pk.eyJ1IjoiaG9uZ2xpbmdqaW4xOTk0IiwiYSI6ImNrczhvZTNmbDN0ZnEycHM3aTkyanp3NmsifQ.iCdeT5IE9GlGKmExl0U6zA'; // 替换为你的 token

    const map = new mapboxgl.Map({
      container: this.shadowRoot.getElementById('map'),
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [116.397428, 39.90923],
      zoom: 12,
      attributionControl: false,
      language: 'zh-Hans', // 设置为简体中文
      localIdeographFontFamily: "'Microsoft YaHei', 'SimHei', sans-serif",
    });

    // 在地图加载完成后设置中文显示
    map.on('load', () => {
      // 更全面的中文标签设置
      const setChineseLabels = () => {
        const labelLayers = map
          .getStyle()
          .layers.filter(
            (layer) =>
              layer.id.includes('label') ||
              layer.id.includes('place') ||
              layer.id.includes('poi') ||
              layer.id.includes('text')
          );

        labelLayers.forEach((layer) => {
          if (map.getLayoutProperty(layer.id, 'text-field')) {
            map.setLayoutProperty(layer.id, 'text-field', [
              'coalesce',
              ['get', 'name_zh'],
              ['get', 'name'],
            ]);
          }
        });
      };

      setChineseLabels();

      // 监听样式变化，重新应用中文设置
      map.on('styledata', setChineseLabels);

      // 设置深蓝色样式
      map.setPaintProperty(
        'background',
        'background-color',
        'rgba(0, 9, 36, 0.8)'
      );
      map.setPaintProperty('water', 'fill-color', 'rgba(0, 15, 60, 0.8)');
      map.setPaintProperty('land', 'background-color', 'rgba(0, 9, 36, 0.8)');
      map.setPaintProperty('building', 'fill-color', 'rgba(0, 12, 45, 0.8)');

      map.addLayer(
        {
          id: 'color-overlay',
          type: 'background',
          paint: {
            'background-color': 'rgba(0, 9, 36, 0.3)',
            'background-opacity': 0.7,
          },
        },
        'country-label'
      );
    });
  }
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
    const mapDiv = this.shadowRoot.querySelector('#map');
    if (mapDiv) {
      this.initMap();
    }
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
            <div class="header">
              <div class="header-left">
                <div>
                  ${this.currentLocation} &nbsp;&nbsp;&nbsp;
                  时间：${this.currentTime}
                </div>
              </div>
              <div class="header-center">测试</div>
              <div style="width: 200px"></div>
              <!-- 用于平衡布局的空div -->
            </div>

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
            <!-- 添加地图容器 -->
            <div id="map"></div>
          `
        : ''}
      <div class="content"></div>
    `;
  }
}

customElements.define('home-page', HomePage);
