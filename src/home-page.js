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
import '@/modules/device-management/components/device-add.js';
import '@/modules/task-management/components/task-create-component.js';
import '@/modules/device-control/components/device-query.js';
import styles from './home-page.css?inline';

// 地图基础配置常量
const MAP_CONFIG = {
  accessToken:
    'pk.eyJ1IjoiaG9uZ2xpbmdqaW4xOTk0IiwiYSI6ImNrczhvZTNmbDN0ZnEycHM3aTkyanp3NmsifQ.iCdeT5IE9GlGKmExl0U6zA',  // Mapbox访问令牌
  style: 'mapbox://styles/mapbox/dark-v11',  // 地图样式
  center: [116.397428, 39.90923],  // 初始中心点坐标（北京）
  zoom: 12,  // 初始缩放级别
  attributionControl: false,  // 关闭属性控制
  language: 'zh-Hans',  // 使用简体中文
  localIdeographFontFamily: "'Microsoft YaHei', 'SimHei', sans-serif"  // 中文字体设置
};

// 地图样式配置常量
const MAP_STYLE_CONFIG = {
  background: '#000924',  // 背景色
  water: '#000f3c',      // 水域颜色
  building: {
    color: '#000c2d',    // 建筑物颜色
    opacity: 0.8         // 建筑物透明度
  },
  overlay: {
    color: '#000924',    // 覆盖层颜色
    opacity: 0.3         // 覆盖层透明度
  }
};

class HomePage extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  static properties = {
    currentTime: { type: String },
    currentLocation: { type: String },
    points: { type: Array },
    draw: { type: Object },
    selectedDevices: { type: Array },
    tempMarkers: { type: Array },
    deviceList: { type: Array },
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
    this.selectedDevices = [];
    this.tempMarkers = [];
    this.deviceList = [];
    
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

    window.addEventListener('location-selected', (e) => {
      this.handleLocationSelect(e.detail.location, e.detail.coordinates);
    });

    window.addEventListener('add-map-point', (e) => {
      this.addMapPoint(e.detail.point);
    });

    window.addEventListener('convert-temp-marker', (e) => {
      this.convertTempMarker(e.detail.tempId, e.detail.permanentPoint);
    });

    window.addEventListener('clear-temp-marker', (e) => {
      this.clearTempMarker(e.detail.id);
    });

    window.addEventListener('reset-map-view', (e) => {
      this.resetMapView(e.detail.center, e.detail.zoom);
    });

    // 添加设备提交事件监听
    window.addEventListener('device-submit', (e) => {
      const deviceData = e.detail;
      this.convertDeviceMarker(deviceData);
    });

    // 修改设备列表更新事件监听
    window.addEventListener('devices-updated', (e) => {
      this.deviceList = e.detail.devices;
      this.syncDevicesWithMap();  // 使用新方法替代 updateDeviceMarkers
    });

    // 添加定位事件监听
    window.addEventListener('locate-device', (event) => {
      const { lat, lon, deviceId, deviceName } = event.detail;
      
      if (window.mapInstance) {
        // 飞行到目标位置
        window.mapInstance.flyTo({
          center: [lon, lat],
          zoom: 17,
          duration: 1000,
          essential: true
        });

        console.log(`正在定位到设备: ${deviceName}(${deviceId})`, { lat, lon });
      }
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

  // 初始化地图
  initMap() {
    try {
      mapboxgl.accessToken = MAP_CONFIG.accessToken;

      const map = new mapboxgl.Map({
        container: this.shadowRoot.getElementById('map'),
        style: MAP_CONFIG.style,
        center: MAP_CONFIG.center,
        zoom: MAP_CONFIG.zoom,
        attributionControl: MAP_CONFIG.attributionControl,
        localIdeographFontFamily: MAP_CONFIG.localIdeographFontFamily
      });

      // 添加错误处理
      map.on('error', (e) => {
        console.error('地图加载错误:', e.error);
      });

      // 确保地图加载完成后再进行操作
      map.on('load', () => {
        window.mapInstance = map;
        this.initMapDraw(map);
        this.initMapLayers(map);
        this.setMapStyle(map);
        
        // 延迟设置中文标签，确保样式加载完成
        setTimeout(() => {
          this.setChineseLabels(map);
        }, 1000);
        
        // 地图加载完成后，如果已有设备数据，立即同步
        if (this.deviceList && this.deviceList.length > 0) {
          this.syncDevicesWithMap();
        }
      });

      // 添加地图事件监听
      this.initMapEventListeners(map);

    } catch (err) {
      console.error('初始化地图失败:', err);
    }
  }

  // 初始化地图绘图工具
  initMapDraw(map) {
    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        point: true,      // 启用点标记工具
        polygon: true,    // 启用多边形工具
        trash: true,      // 启用删除工具
      },
    });

    map.addControl(this.draw);
  }

  // 初始化地图事件监听器
  initMapEventListeners(map) {
    // 监听多边形创建事件
    window.addEventListener('polygon-created', (e) => {
      const polygon = e.detail.polygon;

      const points = {
        type: 'FeatureCollection',
        features: this.points.map((point) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [point.lng, point.lat],
          },
          properties: point.properties,
        })),
      };

      const selectedPoints = {
        type: 'FeatureCollection',
        features: points.features.filter((point) => {
          return turf.booleanPointInPolygon(point, polygon);
        }),
      };

      map.getSource('selected-points').setData(selectedPoints);

      // 添加选中点数量的提示
      const count = selectedPoints.features.length;
      alert(`选中点位数量: ${count}`);
    });

    // 监听开始拾取点位事件
    window.addEventListener('start-picking', (e) => {
      this.currentPickingPosition = e.detail.position;
    });

    // 监听删除要素事件
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
        features: [],
      });
    });

    // 监听创建要素事件
    map.on('draw.create', (e) => {
      if (e.features[0].geometry.type === 'Polygon') {
        const polygon = e.features[0];

        const points = {
          type: 'FeatureCollection',
          features: this.points.map((point) => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [point.lng, point.lat],
            },
            properties: point.properties,
          })),
        };

        const selectedPoints = {
          type: 'FeatureCollection',
          features: points.features.filter((point) => {
            return turf.booleanPointInPolygon(point, polygon);
          }),
        };

        map.getSource('selected-points').setData(selectedPoints);

        // 添加选中点数量的提示
        const count = selectedPoints.features.length;
        alert(`选中点位数量: ${count}`);
      }
    });

    // 监听地图点击事件
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

  // 初始化地图图层
  initMapLayers(map) {
    try {
      map.loadImage('/public/images/marker-icon.png', (error, image) => {
        if (error) throw error;
        
        map.addImage('marker-icon', image);
        
        // 添加数据源
        map.addSource('test-points', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          }
        });

        // 修改图层配置，调整点位大小
        map.addLayer({
          id: 'test-points-layer',
          type: 'symbol',
          source: 'test-points',
          layout: {
            'icon-image': 'marker-icon',
            // 将图标大小调小到 0.3
            'icon-size': 0.2,
            'icon-allow-overlap': true,
            'icon-ignore-placement': true,
            // 文本标签配置
            'text-field': ['get', 'name'],
            'text-font': ['Open Sans Regular'],
            'text-offset': [0, 1],
            'text-anchor': 'top',
            'text-size': 10
          },
          paint: {
            'text-color': '#ffffff',
            'text-halo-color': '#000000',
            'text-halo-width': 1
          }
        });

        // 添加鼠标交互
        map.on('mouseenter', 'test-points-layer', () => {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'test-points-layer', () => {
          map.getCanvas().style.cursor = '';
        });
      });
    } catch (err) {
      console.error('初始化图层失败:', err);
    }
  }

  // 设置地图样式
  setMapStyle(map) {
    try {
      const layers = {
        background: {
          property: 'background-color',
          value: MAP_STYLE_CONFIG.background
        },
        water: {
          property: 'fill-color',
          value: MAP_STYLE_CONFIG.water
        },
        building: [
          {
            property: 'fill-color',
            value: MAP_STYLE_CONFIG.building.color
          },
          {
            property: 'fill-opacity',
            value: MAP_STYLE_CONFIG.building.opacity
          }
        ]
      };

      Object.entries(layers).forEach(([layerId, config]) => {
        if (!map.getLayer(layerId)) return;

        try {
          if (Array.isArray(config)) {
            config.forEach(({ property, value }) => {
              map.setPaintProperty(layerId, property, value);
            });
          } else {
            map.setPaintProperty(layerId, config.property, config.value);
          }
        } catch (err) {
          console.warn(`设置图层 ${layerId} 样式失败:`, err);
        }
      });

      // 添加颜色覆盖层
      if (!map.getLayer('color-overlay')) {
        map.addLayer({
          id: 'color-overlay',
          type: 'background',
          paint: {
            'background-color': MAP_STYLE_CONFIG.overlay.color,
            'background-opacity': MAP_STYLE_CONFIG.overlay.opacity
          }
        });
      }
    } catch (err) {
      console.warn('设置地图样式失败:', err);
    }
  }

  // 设置中文标签
  setChineseLabels(map) {
    try {
      const layers = map.getStyle().layers;
      const labelLayers = layers.filter(layer => {
        return layer.type === 'symbol' && (
          layer.id.includes('label') ||
          layer.id.includes('place') ||
          layer.id.includes('poi') ||
          layer.id.includes('text')
        );
      });

      labelLayers.forEach(layer => {
        try {
          const textField = map.getLayoutProperty(layer.id, 'text-field');
          if (textField) {
            map.setLayoutProperty(layer.id, 'text-field', [
              'coalesce',
              ['get', 'name_zh-Hans'],
              ['get', 'name_zh'],
              ['get', 'name']
            ]);
          }
        } catch (err) {
          console.warn(`设置图层 ${layer.id} 的中文标签失败:`, err);
        }
      });
    } catch (err) {
      console.warn('设置中文标签失败:', err);
    }
  }

  // 更新坐标输入框
  updateInputField(position, coords) {
    const event = new CustomEvent('update-coordinates', {
      detail: {
        position: position,
        coordinates: `${coords[0]}, ${coords[1]}`,
      },
    });
    window.dispatchEvent(event);
  }

  // 绘制多边形
  drawPolygon(points) {
    const positions = ['左上', '右上', '右下', '左下'];
    const orderedPoints = positions.map(
      (pos) =>
        points.find((p) => p.properties.position === pos).geometry.coordinates
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
      detail: { polygon },
    });
    window.dispatchEvent(event);
  }

  // 拟合对角点
  fitDiagonalPoints() {
    // 获取当前绘制的点位
    const features = this.draw.getAll().features;
    const points = features.filter((f) => f.geometry.type === 'Point');

    // 验证点位数量
    if (points.length !== 2) {
      console.warn('需要恰两个对角点才能进拟合');
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
      const rightTopPoint = points.find(
        (p) => p.properties.position === '右上'
      );
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
  handleLocationSelect(location, coordinates) {
    if (window.mapInstance) {
      window.mapInstance.flyTo({
        center: coordinates,
        zoom: 12,
        duration: 2000,  // Smooth transition over 2 seconds
        essential: true  // Ensures the camera will move if the user has not interacted with the map
      });

      // Optional: Update current location display
      this.currentLocation = location;
    }
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
            <div class="location-selector">
              <a @click="${() => this.handleLocationSelect('中卫定标场', [105.18, 37.51	])}">中卫定标场</a>
              <a @click="${() => this.handleLocationSelect('嵩山定标场', [113.004052, 34.519664])}">嵩山定标场</a>
            </div>
          `
        : ''}
      <div class="content"></div>
    `;
  }

  // 更新点位数据
  updatePoints(map, polygon = null) {
    const points = this.createPointsFeatureCollection();
    const selectedPoints = polygon 
      ? this.filterPointsInPolygon(points, polygon)
      : { type: 'FeatureCollection', features: [] };

    map.getSource('selected-points').setData(selectedPoints);
    
    if (polygon) {
      alert(`选中点位数量: ${selectedPoints.features.length}`);
    }
  }

  // 创建点位要素集合
  createPointsFeatureCollection() {
    return {
      type: 'FeatureCollection',
      features: this.points.map((point) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [point.lng, point.lat],
        },
        properties: point.properties,
      })),
    };
  }

  // 过滤多边形内的点位
  filterPointsInPolygon(points, polygon) {
    return {
      type: 'FeatureCollection',
      features: points.features.filter((point) =>
        turf.booleanPointInPolygon(point, polygon)
      ),
    };
  }

  // 清除坐标输入框
  clearCoordinateInputs() {
    ['左上', '右上', '左下', '右下'].forEach(position => {
      this.updateInputField(position, '');
    });
  }

  // 添加新的方法
  addMapPoint(point) {
    if (this.draw) {
      // 先清除同ID的临时点位
      this.clearTempMarker(point.properties.id);
      
      // 添加新的临时点位
      const pointId = this.draw.add(point)[0];
      this.tempMarkers.push({
        id: point.properties.id,
        drawId: pointId
      });
    }
  }

  convertTempMarker(tempId, permanentPoint) {
    if (window.mapInstance) {
      // 清除临时点
      this.clearTempMarker(tempId);
      
      // 更新点位数据源
      const source = window.mapInstance.getSource('test-points');
      if (source) {
        const currentData = source.getData();
        currentData.features.push(permanentPoint);
        source.setData(currentData);
      }
    }
  }

  clearTempMarker(id) {
    const markerIndex = this.tempMarkers.findIndex(m => m.id === id);
    if (markerIndex !== -1) {
      const marker = this.tempMarkers[markerIndex];
      this.draw.delete(marker.drawId);
      this.tempMarkers.splice(markerIndex, 1);
    }
  }

  resetMapView(center, zoom) {
    if (window.mapInstance) {
      window.mapInstance.flyTo({
        center: center,
        zoom: zoom,
        duration: 2000
      });
    }
  }

  // 添加设备点位转换方法
  convertDeviceMarker(deviceData) {
    if (!window.mapInstance) return;

    // 创建永久点位特征
    const permanentPoint = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [deviceData.lon, deviceData.lat]
      },
      properties: {
        id: deviceData.id,
        name: deviceData.deviceName,
        type: deviceData.deviceType,
        ...deviceData.properties
      }
    };

    // 更新地图数据源
    const source = window.mapInstance.getSource('test-points');
    if (source) {
      const currentData = source._data || { type: 'FeatureCollection', features: [] };
      currentData.features.push(permanentPoint);
      source.setData(currentData);

      // 将新点位添加到 this.points 数组
      const newPoint = {
        lng: deviceData.lon,
        lat: deviceData.lat,
        properties: {
          id: deviceData.id,
          name: deviceData.deviceName,
          type: deviceData.deviceType,
          ...deviceData.properties
        }
      };
      
      // 添加到 points 数组
      this.points.push(newPoint);
      
      // 保存到 localStorage
      try {
        const existingPoints = JSON.parse(localStorage.getItem('mapPoints') || '[]');
        existingPoints.push(newPoint);
        localStorage.setItem('mapPoints', JSON.stringify(existingPoints));
      } catch (err) {
        console.warn('保存点位到 localStorage 失败:', err);
      }
    }

    // 清除对应的临时点位
    this.clearTempMarker('new-device');
  }

  // 添加坐标验证函数
  validateCoordinates(lat, lon) {
    if (lat === null || lat === undefined || lon === null || lon === undefined) {
      return false;
    }

    // 直接使用 parseFloat，不使用 toFixed 截断精度
    const numLat = parseFloat(String(lat));
    const numLon = parseFloat(String(lon));

    console.log('坐标验证:', {
      原始lat: lat,
      原始lon: lon,
      转换后lat: numLat,
      转换后lon: numLon,
      lat类型: typeof numLat,
      lon类型: typeof numLon
    });

    return (
      !isNaN(numLat) && 
      !isNaN(numLon) && 
      numLat >= -90.000000 && 
      numLat <= 90.000000 && 
      numLon >= -180.000000 && 
      numLon <= 180.000000
    );
  }

  // 修改设备数据处理逻辑
  async syncDevicesWithMap() {
    try {
      const features = this.deviceList
        .filter(device => this.validateCoordinates(device.lat, device.lon))
        .map(device => this.createFeature(device));

      // 检查坐标精度
      features.forEach(feature => {
        const [lon, lat] = feature.geometry.coordinates;
        console.log(`设备 ${feature.properties.id} 最终坐标:`, {
          经度: lon,
          纬度: lat,
          精度: {
            lon小数位: String(lon).split('.')[1]?.length || 0,
            lat小数位: String(lat).split('.')[1]?.length || 0
          }
        });
      });

      const featureCollection = {
        type: 'FeatureCollection',
        features: features
      };

      const source = window.mapInstance.getSource('test-points');
      if (source) {
        source.setData(featureCollection);
      }
    } catch (error) {
      console.error('同步设备数据到地图失败:', error);
    }
  }

  // 优化地图视图调整方法
  fitMapToDevices(features) {
    if (!features.length || !window.mapInstance) return;

    try {
      const bounds = new mapboxgl.LngLatBounds();
      
      features.forEach(feature => {
        const coords = feature.geometry.coordinates;
        if (Array.isArray(coords) && coords.length === 2) {
          bounds.extend(coords);
        }
      });

      // 只有当边界框有效时才进行调整
      if (!bounds.isEmpty()) {
        window.mapInstance.fitBounds(bounds, {
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          maxZoom: 15,
          duration: 1000
        });
      }
    } catch (error) {
      console.warn('调整地图视图失败:', error);
    }
  }

  // 修改设备详情获取和坐标处理
  async getDeviceDetails(deviceId) {
    try {
      const response = await deviceService.getDeviceDetails(deviceId);
      
      // 确保经纬度保留完整精度，不要四舍五入或截断
      const lat = response.lat ? parseFloat(response.lat) : null;
      const lon = response.lon ? parseFloat(response.lon) : null;
      
      console.log(`设备 ${deviceId} 的精确坐标:`, {
        原始lat: response.lat,
        原始lon: response.lon,
        转换后lat: lat,
        转换后lon: lon
      });

      return {
        ...response,
        lat: lat,
        lon: lon
      };
    } catch (error) {
      console.error(`获取设备 ${deviceId} 详情失败:`, error);
      throw error;
    }
  }

  // 修改特征创建逻辑
  createFeature(device) {
    // 保留完整精度的坐标转换
    const coordinates = [
      parseFloat(String(device.lon)),
      parseFloat(String(device.lat))
    ];

    console.log(`设备 ${device.id} 的完整坐标:`, {
      设备名称: device.deviceName,
      原始坐标: [device.lon, device.lat],
      转换后坐标: coordinates
    });

    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: coordinates
      },
      properties: {
        id: device.id,
        name: device.deviceName || '',
        type: device.deviceType || '',
        region: device.region || '',
        status: device.deviceStatus || '',
        connectionStatus: device.connectionStatus || '',
        powerStatus: device.powerStatus || ''
      }
    };
  }
}

customElements.define('home-page', HomePage);
