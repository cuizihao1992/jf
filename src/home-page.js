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
import '@/components/login-page.js';
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

    window.addEventListener('fit-diagonal-points', () => {
      this.fitDiagonalPoints();
    });

    window.addEventListener('draw-polygon', (e) => {
      const allPoints = this.draw.getAll();
      if (allPoints.features.length === 4) {
        this.drawPolygon(allPoints.features);
      }
    });

    window.addEventListener('change-draw-mode', (e) => {
      this.drawMode = e.detail.mode;
      if (this.drawMode === 'draw') {
        this.draw.changeMode('draw_polygon');
      } else {
        this.draw.changeMode('simple_select');
        this.draw.deleteAll();
      }
    });

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

    window.mapInstance = map;

    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        point: true,
        polygon: true,
        trash: true,
      },
    });

    map.addControl(this.draw);

    map.on('load', () => {
      this.points = [
        { lng: 116.397, lat: 39.909, properties: { id: 1 } },
        { lng: 116.398, lat: 39.910, properties: { id: 2 } },
        { lng: 116.396, lat: 39.908, properties: { id: 3 } },
        { lng: 116.399, lat: 39.911, properties: { id: 4 } },
        { lng: 116.395, lat: 39.907, properties: { id: 5 } },
      ];

      map.addSource('test-points', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: this.points.map(point => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [point.lng, point.lat]
            },
            properties: point.properties
          }))
        }
      });

      map.addLayer({
        id: 'test-points-layer',
        type: 'circle',
        source: 'test-points',
        paint: {
          'circle-radius': 6,
          'circle-color': '#4CAF50',
          'circle-opacity': 0.8
        }
      });

      map.addSource('selected-points', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      map.addLayer({
        id: 'selected-points-layer',
        type: 'circle',
        source: 'selected-points',
        paint: {
          'circle-radius': 6,
          'circle-color': '#FF0000',
          'circle-opacity': 0.7
        }
      });

      this.setMapStyle(map);
      this.setChineseLabels(map);
    });

    window.addEventListener('polygon-created', (e) => {
      const polygon = e.detail.polygon;
      
      const points = {
        type: 'FeatureCollection',
        features: this.points.map(point => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [point.lng, point.lat]
          },
          properties: point.properties
        }))
      };

      const selectedPoints = {
        type: 'FeatureCollection',
        features: points.features.filter(point => {
          return turf.booleanPointInPolygon(point, polygon);
        })
      };

      map.getSource('selected-points').setData(selectedPoints);

      // 添加选中点数量的提示
      const count = selectedPoints.features.length;
      alert(`选中点位数量: ${count}`);
    });

    window.addEventListener('start-picking', (e) => {
      this.currentPickingPosition = e.detail.position;
    });

    map.on('draw.delete', () => {
      // 清除坐标输入框
      const event = new CustomEvent('update-coordinates', {
        detail: {
          position: '左上',
          coordinates: '',
        },
      });
      window.dispatchEvent(event);
    
      event.detail.position = '右上';
      window.dispatchEvent(event);
    
      event.detail.position = '左下';
      window.dispatchEvent(event);
    
      event.detail.position = '右下';
      window.dispatchEvent(event);
    
      // 清除选中点图层
      map.getSource('selected-points').setData({
        type: 'FeatureCollection',
        features: []
      });
    });
     // 添加绘制多边形完成事件监听
     map.on('draw.create', (e) => {
      if (e.features[0].geometry.type === 'Polygon') {
        const polygon = e.features[0];
        
        const points = {
          type: 'FeatureCollection',
          features: this.points.map(point => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [point.lng, point.lat]
            },
            properties: point.properties
          }))
        };

        const selectedPoints = {
          type: 'FeatureCollection',
          features: points.features.filter(point => {
            return turf.booleanPointInPolygon(point, polygon);
          })
        };

        map.getSource('selected-points').setData(selectedPoints);

        // 添加选中点数量的提示
        const count = selectedPoints.features.length;
        alert(`选中点位数量: ${count}`);
      }
    });
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

      const existingPoints = this.draw.getAll();
      existingPoints.features.forEach((feature) => {
        if (feature.properties.position === this.currentPickingPosition) {
          this.draw.delete(feature.id);
        }
      });

      const pointId = this.draw.add(point)[0];
      const addedFeature = this.draw.get(pointId);
      addedFeature.properties = { position: this.currentPickingPosition };
      this.draw.add(addedFeature);

      this.updateInputField(this.currentPickingPosition, coords);
      this.currentPickingPosition = null;
    });
  }

  setMapStyle(map) {
    if (map.getLayer('background')) {
      map.setPaintProperty('background', 'background-color', '#000924');
    }

    if (map.getLayer('water')) {
      map.setPaintProperty('water', 'fill-color', '#000f3c');
    }

    if (map.getLayer('building')) {
      map.setPaintProperty('building', 'fill-color', '#000c2d');
      map.setPaintProperty('building', 'fill-opacity', 0.8);
    }

    if (!map.getLayer('color-overlay')) {
      map.addLayer({
        id: 'color-overlay',
        type: 'background',
        paint: {
          'background-color': '#000924',
          'background-opacity': 0.3,
        },
      });
    }
  }

  setChineseLabels(map) {
    const labelLayers = map.getStyle().layers.filter(
      layer => layer.id.includes('label') || 
               layer.id.includes('place') || 
               layer.id.includes('poi') || 
               layer.id.includes('text')
    );

    labelLayers.forEach(layer => {
      if (map.getLayoutProperty(layer.id, 'text-field')) {
        map.setLayoutProperty(layer.id, 'text-field', [
          'coalesce',
          ['get', 'name_zh'],
          ['get', 'name'],
        ]);
      }
    });
  }

  updateInputField(position, coords) {
    const event = new CustomEvent('update-coordinates', {
      detail: {
        position: position,
        coordinates: `${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`,
      },
    });
    window.dispatchEvent(event);
  }

  drawPolygon(points) {
    const positions = ['左上', '右上', '右下', '左下'];
    const orderedPoints = positions.map(
      (pos) => points.find((p) => p.properties.position === pos).geometry.coordinates
    );
  
    const polygon = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [[...orderedPoints, orderedPoints[0]]],
      },
    };
  
    this.draw.deleteAll();
    this.draw.add(polygon);
  
    const event = new CustomEvent('polygon-created', {
      detail: { polygon }
    });
    window.dispatchEvent(event);
  }

  fitDiagonalPoints() {
    const features = this.draw.getAll().features;
    const points = features.filter((f) => f.geometry.type === 'Point');
    
    if (points.length !== 2) {
      console.warn('需要恰好两个对角点才能进行拟合');
      return;
    }

    const positions = points.map((p) => p.properties.position);
    const isDiagonal =
      (positions.includes('左上') && positions.includes('右下')) ||
      (positions.includes('右上') && positions.includes('左下'));

    if (!isDiagonal) {
      console.warn('需要选择对角点才能进行拟合');
      return;
    }

    const point1 = points[0].geometry.coordinates;
    const point2 = points[1].geometry.coordinates;
    const width = Math.abs(point2[0] - point1[0]);
    const height = Math.abs(point2[1] - point1[1]);

    let leftTop, rightTop, rightBottom, leftBottom;

    if (positions.includes('左上')) {
      const leftTopPoint = points.find((p) => p.properties.position === '左上');
      leftTop = leftTopPoint.geometry.coordinates;
      rightTop = [leftTop[0] + width, leftTop[1]];
      rightBottom = [leftTop[0] + width, leftTop[1] - height];
      leftBottom = [leftTop[0], leftTop[1] - height];
    } else {
      const rightTopPoint = points.find((p) => p.properties.position === '右上');
      rightTop = rightTopPoint.geometry.coordinates;
      leftTop = [rightTop[0] - width, rightTop[1]];
      leftBottom = [rightTop[0] - width, rightTop[1] - height];
      rightBottom = [rightTop[0], rightTop[1] - height];
    }

    this.draw.deleteAll();

    const corners = [
      { coords: leftTop, position: '左上' },
      { coords: rightTop, position: '右上' },
      { coords: rightBottom, position: '右下' },
      { coords: leftBottom, position: '左下' },
    ];

    corners.forEach(({ coords, position }) => {
      const point = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: coords,
        },
        properties: { position },
      };
      this.draw.add(point);
      this.updateInputField(position, coords);
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
      { path: '/login', component: 'login-page' },
      { path: '(.*)', redirect: '/' },
    ]);

    window.addEventListener('popstate', () => {
      this.requestUpdate();
    });

    const mapDiv = this.shadowRoot.querySelector('#map');
    if (mapDiv) {
      this.initMap();
    }
  }

  isLoginPage() {
    return window.location.pathname === '/login';
  }

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
            </div>

            <div class="nav">
              <div class="nav-left">
                <a href="/" class="${this.isActive('/')}">系统首页</a>
                <a href="/device-control" class="${this.isActive('/device-control')}">设备控制</a>
                <a href="/task-management" class="${this.isActive('/task-management')}">任务管理</a>
              </div>

              <div class="nav-right">
                <a href="/device-management" class="${this.isActive('/device-management')}">设备管理</a>
                <a href="/user-management" class="${this.isActive('/user-management')}">用户管理</a>
                <a href="/log-management" class="${this.isActive('/log-management')}">日志管理</a>
              </div>
            </div>
            <div id="map"></div>
          `
        : ''}
      <div class="content"></div>
    `;
  }
}

customElements.define('home-page', HomePage);