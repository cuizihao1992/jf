import { LitElement, html, css, unsafeCSS } from 'lit';
import { Router } from '@vaadin/router';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';

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
    points: { type: Array },
    draw: { type: Object },
  };

  constructor() {
    super();
    this.currentTime = '';
    this.currentLocation = '北京市';
    this.updateTime();
    this.points = [];
    this.draw = null;
    this.currentPickingPosition = null;
    this.drawMode = 'pick';

    // 添加确定按钮的事件监听
    window.addEventListener('draw-polygon', (e) => {
      const allPoints = this.draw.getAll();
      if (allPoints.features.length === 4) {
        this.drawPolygon(allPoints.features);
      }
    });
    // 添加模式切换事件监听
    window.addEventListener('change-draw-mode', (e) => {
      this.drawMode = e.detail.mode;
      if (this.drawMode === 'draw') {
        this.draw.changeMode('draw_polygon');
      } else {
        this.draw.changeMode('simple_select');
        this.draw.deleteAll();
      }
    });

    // 添加清除特征事件监听
    window.addEventListener('clear-all-features', () => {
      this.draw.deleteAll();
    });
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
    mapboxgl.accessToken = 'pk.eyJ1IjoiaG9uZ2xpbmdqaW4xOTk0IiwiYSI6ImNrczhvZTNmbDN0ZnEycHM3aTkyanp3NmsifQ.iCdeT5IE9GlGKmExl0U6zA';
  
    const map = new mapboxgl.Map({
      container: this.shadowRoot.getElementById('map'),
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [116.397428, 39.90923],
      zoom: 12,
      attributionControl: false,
      language: 'zh-Hans',
      localIdeographFontFamily: "'Microsoft YaHei', 'SimHei', sans-serif",
    });
  
    // 在地图加载完成后设置中文显示和样式
    map.on('load', () => {
      // 先添加 Draw 控件
      this.draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          point: true,
          polygon: true,
          trash: true,
        },
      });
      map.addControl(this.draw);
  
      // 然后设置地图样式
      map.setPaintProperty('background', 'background-color', 'rgba(0, 9, 36, 0.8)');
      map.setPaintProperty('water', 'fill-color', 'rgba(0, 15, 60, 0.8)');
      map.setPaintProperty('land', 'background-color', 'rgba(0, 9, 36, 0.8)');
      map.setPaintProperty('building', 'fill-color', 'rgba(0, 12, 45, 0.8)');
  
      // 添加颜色覆盖层
      if (!map.getLayer('color-overlay')) {
        map.addLayer({
          id: 'color-overlay',
          type: 'background',
          paint: {
            'background-color': 'rgba(0, 9, 36, 0.3)',
            'background-opacity': 0.7,
          },
        });
      }
  
      // 设置中文标签
      const setChineseLabels = () => {
        const labelLayers = map.getStyle().layers.filter(layer =>
          layer.id.includes('label') || 
          layer.id.includes('place') || 
          layer.id.includes('poi') || 
          layer.id.includes('text')
        );
  
        labelLayers.forEach(layer => {
          if (map.getLayoutProperty(layer.id, 'text-field')) {
            map.setLayoutProperty(layer.id, 'text-field', [
              'coalesce',
              ['get', 'name_zh'],
              ['get', 'name']
            ]);
          }
        });
      };
  
      setChineseLabels();
      map.on('styledata', setChineseLabels);
    });
  
    // 监听开始拾取事件
    window.addEventListener('start-picking', (e) => {
      this.currentPickingPosition = e.detail.position;
    });
  
    // 监听点击事件
    map.on('click', (e) => {
      if (this.drawMode !== 'pick' || !this.currentPickingPosition) return;
      const coords = [e.lngLat.lng, e.lngLat.lat];
      const point = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: coords,
        },
      };
  
      // 监听绘制创建事件
      map.on('draw.create', (e) => {
        if (this.drawMode === 'draw') {
          const polygon = e.features[0];
          // 处理绘制的多边形
          console.log('Drawn polygon:', polygon);
        }
      });
  
      // 清除之前的点（如果存在）
      const existingPoints = this.draw.getAll();
      existingPoints.features.forEach((feature) => {
        if (feature.properties.position === this.currentPickingPosition) {
          this.draw.delete(feature.id);
        }
      });
  
      // 添加新的点
      const pointId = this.draw.add(point)[0];
      const addedFeature = this.draw.get(pointId);
      addedFeature.properties = { position: this.currentPickingPosition };
      this.draw.add(addedFeature);
  
      // 更新坐标 - 直接传入位置字符串
      this.updateInputField(this.currentPickingPosition, coords);
  
      // 重置当前拾取位置
      this.currentPickingPosition = null;
    });
  }

  updateInputField(position, coords) {
    console.log('Updating coordinates:', position, coords); // 调试日志

    // 使用全局事件
    const event = new CustomEvent('update-coordinates', {
      detail: {
        position: position,
        coordinates: `${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`,
      },
    });
    window.dispatchEvent(event);
  }

  // 添加绘制多边形的方法
  drawPolygon(points) {
    // 将点按照顺序排列（左上、右上、右下、左下）
    const positions = ['左上', '右上', '右下', '左下'];
    const orderedPoints = positions.map(
      (pos) =>
        points.find((p) => p.properties.position === pos).geometry.coordinates
    );

    const polygon = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [[...orderedPoints, orderedPoints[0]]], // 闭合多边形
      },
    };

    // 删除所有点
    this.draw.deleteAll();
    // 添加多边形
    this.draw.add(polygon);
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
