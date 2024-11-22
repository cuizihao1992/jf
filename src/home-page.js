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
    'pk.eyJ1IjoiaG9uZ2xpbmdqaW4xOTk0IiwiYSI6ImNrczhvZTNmbDN0ZnEycHM3aTkyanp3NmsifQ.iCdeT5IE9GlGKmExl0U6zA', // Mapbox访问令牌
  style: 'mapbox://styles/mapbox/dark-v11', // 地图样式
  center: [116.397428, 39.90923], // 初始中心点坐标（北京）
  zoom: 12, // 初始缩放级别
  attributionControl: false, // 关闭属性控制
  language: 'zh-Hans', // 使用简体中文
  localIdeographFontFamily: "'Microsoft YaHei', 'SimHei', sans-serif", // 中文字体设
};

// 地图样式配置常量
const MAP_STYLE_CONFIG = {
  background: '#000924', // 背景色
  water: '#000f3c', // 水域颜色
  building: {
    color: '#000c2d', // 建筑物颜色
    opacity: 0.8, // 建筑物透明度
  },
  overlay: {
    color: '#000924', // 覆盖层颜色
    opacity: 0.3, // 覆盖层透明度
  },
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
      const points = allPoints.features.filter(
        (f) => f.geometry.type === 'Point'
      );

      if (points.length === 4) {
        const polygon = this.drawPolygon(points);
        if (polygon) {
          if (this.drawMode === 'pick') {
            this.checkPointsInPolygon(polygon);
          }
        }
      } else {
        console.warn('需要四个点才能创建多边形');
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
      // 如果是新增设备，将新设备添加到现有列表中
      if (e.detail.devices.length === 1) {
        const newDevice = e.detail.devices[0];
        // 检查设备是否已存在
        const existingIndex = this.deviceList.findIndex(
          (device) => device.id === newDevice.id
        );
        if (existingIndex === -1) {
          // 如果是新设备，添加到列表
          this.deviceList.push(newDevice);
        } else {
          // 如果设备已存在，更新设备信息
          this.deviceList[existingIndex] = newDevice;
        }
      } else {
        // 如果是完整的设备列表更新，直接替换
        this.deviceList = e.detail.devices;
      }

      // 同步到地图显示
      this.syncDevicesWithMap();
    });

    // 添加定位事件监听
    window.addEventListener('locate-device', (event) => {
      try {
        const { lat, lon, deviceId, deviceName } = event.detail;

        // 验证坐标
        if (!this.validateCoordinates(lat, lon)) {
          console.error('无效的设备坐标:', {
            设备ID: deviceId,
            设备名称: deviceName,
            纬度: lat,
            经度: lon,
          });
          return;
        }

        if (window.mapInstance) {
          console.log('正在定位到设备:', {
            设备ID: deviceId,
            设备名称: deviceName,
            纬度: lat,
            经度: lon,
          });

          // 飞行到目标位置
          window.mapInstance.flyTo({
            center: [lon, lat],
            zoom: 17,
            duration: 1000,
            essential: true,
          });
        }
      } catch (error) {
        console.error('设备定位失败:', error);
      }
    });

    // 添加登录成功事件监听
    window.addEventListener('login-success', async () => {
      console.log('检测到登录成功事件');
      await this.fetchAndDisplayDevices();
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
        localIdeographFontFamily: MAP_CONFIG.localIdeographFontFamily,
      });

      // 确保地图加载完成后再进行操作
      map.on('load', async () => {
        console.log('地图加载完成');
        window.mapInstance = map;

        // 初始化地图组件
        this.initMapDraw(map);
        this.initMapLayers(map);
        this.setMapStyle(map);

        // 延迟设置中文标签
        setTimeout(() => {
          this.setChineseLabels(map);
        }, 1000);

        // 如果已登录，立即获取并显示设备数据
        const token = localStorage.getItem('token');
        if (token) {
          console.log('检测到登录状态，准备获取设备数据');
          await this.fetchAndDisplayDevices();
        }
      });
    } catch (err) {
      console.error('初地图失败:', err);
    }
  }

  // 初始化地图绘图工具
  initMapDraw(map) {
    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        point: true,
        polygon: true,
        trash: true,
      },
      // 添加自定义样式
      styles: [
        {
          id: 'gl-draw-polygon-fill',
          type: 'fill',
          filter: ['all', ['==', '$type', 'Polygon']],
          paint: {
            'fill-color': '#00ffff',
            'fill-outline-color': '#00ffff',
            'fill-opacity': 0.1,
          },
        },
        {
          id: 'gl-draw-polygon-stroke',
          type: 'line',
          filter: ['all', ['==', '$type', 'Polygon']],
          paint: {
            'line-color': '#00ffff',
            'line-width': 2,
          },
        },
        {
          id: 'gl-draw-point',
          type: 'circle',
          filter: ['all', ['==', '$type', 'Point']],
          paint: {
            'circle-radius': 6,
            'circle-color': '#00ffff',
          },
        },
      ],
    });

    map.addControl(this.draw);

    // 添加选中点数据源
    map.addSource('selected-points', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });

    // 添加选中点的光晕效果（外圈）
    map.addLayer({
      id: 'selected-points-halo',
      type: 'circle',
      source: 'selected-points',
      paint: {
        'circle-radius': 35,
        'circle-color': '#00ffff',
        'circle-opacity': 0.15,
        'circle-blur': 1,
      },
    });

    // 添加选中点的发光效果（中圈）
    map.addLayer({
      id: 'selected-points-glow',
      type: 'circle',
      source: 'selected-points',
      paint: {
        'circle-radius': 25,
        'circle-color': '#00ffff',
        'circle-opacity': 0.3,
        'circle-blur': 0.5,
      },
    });

    // 添加选中点的核心图层（内圈）
    map.addLayer({
      id: 'selected-points-core',
      type: 'circle',
      source: 'selected-points',
      paint: {
        'circle-radius': 15,
        'circle-color': '#00ffff',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
      },
    });

    // 初始化地图事件监听器
    this.initMapEventListeners(map);
  }

  // 初始化地图事件监听器
  initMapEventListeners(map) {
    // 监听多边形创建事件
    map.on('draw.create', (e) => {
      if (e.features[0].geometry.type === 'Polygon') {
        // 只在绘制模式下执行点位检测
        if (this.drawMode === 'draw') {
          const polygon = e.features[0];
          this.checkPointsInPolygon(polygon);
        }
      }
    });

    // 监听点击事件，用于拾取坐标
    map.on('click', (e) => {
      if (this.drawMode !== 'pick' || !this.currentPickingPosition) return;

      const coords = [e.lngLat.lng, e.lngLat.lat];
      const point = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: coords,
        },
        properties: {
          position: this.currentPickingPosition,
        },
      };

      // 删除同位置的已有点位
      const existingPoints = this.draw.getAll();
      existingPoints.features.forEach((feature) => {
        if (feature.properties.position === this.currentPickingPosition) {
          this.draw.delete(feature.id);
        }
      });

      // 添加新点位
      this.draw.add(point);

      // 更新坐标输入框
      this.updateInputField(this.currentPickingPosition, coords);
      this.currentPickingPosition = null;
    });

    // 监听删除事件
    map.on('draw.delete', () => {
      // 清除选中点
      map.getSource('selected-points').setData({
        type: 'FeatureCollection',
        features: [],
      });

      // 清除坐标输入框，使用空字符串
      this.clearCoordinateInputs();
    });

    // 监听绘制模式变事件
    window.addEventListener('change-draw-mode', (e) => {
      this.drawMode = e.detail.mode;
      if (this.drawMode === 'draw') {
        this.draw.changeMode('draw_polygon');
      } else {
        this.draw.changeMode('simple_select');
        this.draw.deleteAll();
      }
    });

    // 监听开始拾取事件
    window.addEventListener('start-picking', (e) => {
      this.currentPickingPosition = e.detail.position;
    });
  }

  // 初始化地图图层
  initMapLayers(map) {
    try {
      // 定义 SVG 图标
      const svgIcon = `<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="40" height="40"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#4CB4C4"></path><path d="M517.376 63.616l-0.128 1.6-38.72 507.328-358.912 179.2z" fill="#FFFFFF"></path><path d="M119.616 764.736a13.056 13.056 0 0 1-11.328-19.584L506.048 57.088a13.12 13.12 0 0 1 24.384 7.552l-10.496 0.448 0.64 0.384 9.728 0.768-38.72 507.264a13.12 13.12 0 0 1-7.232 10.752L125.44 763.392a13.376 13.376 0 0 1-5.824 1.344zM499.968 119.936l-347.2 600.576 313.28-156.352 33.92-444.224z" fill="#FFFFFF"></path><path d="M911.616 764.736H119.616a13.056 13.056 0 1 1 0-26.112h769.472L507.072 71.808a13.12 13.12 0 0 1 22.72-12.992l393.28 686.4a13.056 13.056 0 0 1-11.456 19.52z" fill="#FFFFFF"></path><path d="M911.616 764.8a13.632 13.632 0 0 1-4.992-1.024l-433.088-179.2a13.056 13.056 0 0 1 9.984-24.128l433.088 179.136a13.184 13.184 0 0 1 7.104 17.152 13.184 13.184 0 0 1-12.096 8.064z" fill="#FFFFFF"></path></svg>`;

      // 将 SVG 转换为 Base64
      const svgBase64 = btoa(svgIcon);
      const svgUrl = `data:image/svg+xml;base64,${svgBase64}`;

      // 创建一个 Image 对象
      const img = new Image();
      img.onload = () => {
        // 添加图标到地图
        map.addImage('device-icon', img);

        // 添加数据源
        map.addSource('test-points', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        });

        // 修改图层配置
        map.addLayer({
          id: 'test-points-layer',
          type: 'symbol',
          source: 'test-points',
          layout: {
            'icon-image': 'device-icon',
            'icon-size': 0.5, // 调整图标大小
            'icon-allow-overlap': true,
            'icon-ignore-placement': true,
            'text-field': ['get', 'name'],
            'text-font': ['Open Sans Regular'],
            'text-offset': [0, 1.5], // 调整文本偏移
            'text-anchor': 'top',
            'text-size': 12,
          },
          paint: {
            'text-color': '#ffffff',
            'text-halo-color': '#000000',
            'text-halo-width': 1,
          },
        });

        // 添加鼠标交互
        map.on('mouseenter', 'test-points-layer', () => {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'test-points-layer', () => {
          map.getCanvas().style.cursor = '';
        });
      };

      // 设置图片源
      img.src = svgUrl;
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
          value: MAP_STYLE_CONFIG.background,
        },
        water: {
          property: 'fill-color',
          value: MAP_STYLE_CONFIG.water,
        },
        building: [
          {
            property: 'fill-color',
            value: MAP_STYLE_CONFIG.building.color,
          },
          {
            property: 'fill-opacity',
            value: MAP_STYLE_CONFIG.building.opacity,
          },
        ],
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
            'background-opacity': MAP_STYLE_CONFIG.overlay.opacity,
          },
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
      const labelLayers = layers.filter((layer) => {
        return (
          layer.type === 'symbol' &&
          (layer.id.includes('label') ||
            layer.id.includes('place') ||
            layer.id.includes('poi') ||
            layer.id.includes('text'))
        );
      });

      labelLayers.forEach((layer) => {
        try {
          const textField = map.getLayoutProperty(layer.id, 'text-field');
          if (textField) {
            map.setLayoutProperty(layer.id, 'text-field', [
              'coalesce',
              ['get', 'name_zh-Hans'],
              ['get', 'name_zh'],
              ['get', 'name'],
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
    try {
      const positions = ['左上', '右上', '右下', '左下'];
      const orderedPoints = positions.map((pos) => {
        const point = points.find((p) => p.properties.position === pos);
        if (!point) {
          throw new Error(`未找到位置 ${pos} 的点位`);
        }
        return point.geometry.coordinates;
      });

      // 确保多边形闭合
      const polygon = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[...orderedPoints, orderedPoints[0]]],
        },
      };

      console.log('创建的多边形:', polygon);

      // 先删除现有的所有要素
      this.draw.deleteAll();

      // 添加新的多边形
      this.draw.add(polygon);

      return polygon;
    } catch (error) {
      console.error('创建多边形失败:', error);
      return null;
    }
  }

  // 添加点位检测方法
  checkPointsInPolygon(polygon) {
    if (!window.mapInstance || !this.deviceList) return;

    try {
      // 获取当前所有设备点位
      const points = {
        type: 'FeatureCollection',
        features: this.deviceList.map((device) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [parseFloat(device.lon), parseFloat(device.lat)],
          },
          properties: {
            id: device.id,
            name: device.deviceName,
          },
        })),
      };

      console.log('检查的多边形坐标:', polygon.geometry.coordinates);
      console.log('检查的设备点位:', points);

      // 筛选在多边形内的点位
      const selectedPoints = {
        type: 'FeatureCollection',
        features: points.features.filter((point) => {
          try {
            const isInside = turf.booleanPointInPolygon(point, polygon);
            console.log('点位检查:', {
              设备ID: point.properties.id,
              设备名称: point.properties.name,
              坐标: point.geometry.coordinates,
              是否在多边形内: isInside,
            });
            return isInside;
          } catch (error) {
            console.error('点位检查失败:', error);
            return false;
          }
        }),
      };

      // 更新选中点图层
      const source = window.mapInstance.getSource('selected-points');
      if (source) {
        source.setData(selectedPoints);
        console.log('已更新选中点图层:', selectedPoints);

        // 修改动画效果的范围和颜色
        let time = 0;
        const animate = () => {
          // 计算动态半径 - 增大范围
          const haloRadius = 35 + Math.sin(time * 0.05) * 7; // 外圈呼吸效果
          const glowRadius = 25 + Math.sin(time * 0.1) * 5; // 中圈呼吸效果
          const coreRadius = 15 + Math.sin(time * 0.15) * 2; // 内圈呼吸效果

          // 计算动态透明度
          const haloOpacity = 0.15 + Math.sin(time * 0.03) * 0.05;
          const glowOpacity = 0.3 + Math.sin(time * 0.06) * 0.1;

          // 更新各层样式
          window.mapInstance.setPaintProperty(
            'selected-points-halo',
            'circle-radius',
            haloRadius
          );
          window.mapInstance.setPaintProperty(
            'selected-points-halo',
            'circle-opacity',
            haloOpacity
          );

          window.mapInstance.setPaintProperty(
            'selected-points-glow',
            'circle-radius',
            glowRadius
          );
          window.mapInstance.setPaintProperty(
            'selected-points-glow',
            'circle-opacity',
            glowOpacity
          );

          window.mapInstance.setPaintProperty(
            'selected-points-core',
            'circle-radius',
            coreRadius
          );

          // 更新文本效果
          window.mapInstance.setPaintProperty(
            'selected-points-label',
            'text-halo-width',
            1.5 + Math.sin(time * 0.1) * 0.5
          );

          time += 1;
          requestAnimationFrame(animate);
        };

        // 启动动画
        animate();
      }

      // 显示选中点数量
      const count = selectedPoints.features.length;
      console.log('选中的点位数量:', count);
      alert(`选中点位数量: ${count}`);
    } catch (error) {
      console.error('点位检测失败:', error);
    }
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
      (positions.includes('右��') && positions.includes('左下'));

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

      // 如果已登录，尝试获取设备数据
      const token = localStorage.getItem('token');
      if (token) {
        this.fetchAndDisplayDevices();
      }
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
        zoom: 8,
        duration: 2000, // Smooth transition over 2 seconds
        essential: true, // Ensures the camera will move if the user has not interacted with the map
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
                  <button class="timing-btn" @click="${this.handleTiming}">授时</button>
                </div>
              </div>
              <div class="header-center">自动角反射器系统</div>
              <div style="width: 200px"></div>
            </div>

            <div class="nav">
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
            <div id="map"></div>
            <div class="location-selector">
              <a
                @click="${() =>
                  this.handleLocationSelect('中卫定标场', [105.18, 37.51])}"
                >中卫定标场</a
              >
              <a
                @click="${() =>
                  this.handleLocationSelect(
                    '嵩山定标场',
                    [113.004052, 34.519664]
                  )}"
                >嵩山定标场</a
              >
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
    ['左上', '右上', '左下', '右下'].forEach((position) => {
      const event = new CustomEvent('update-coordinates', {
        detail: {
          position: position,
          coordinates: '', // 直接使用空字符串而不是 undefined
        },
      });
      window.dispatchEvent(event);
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
        drawId: pointId,
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
    const markerIndex = this.tempMarkers.findIndex((m) => m.id === id);
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
        duration: 2000,
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
        coordinates: [deviceData.lon, deviceData.lat],
      },
      properties: {
        id: deviceData.id,
        name: deviceData.deviceName,
        type: deviceData.deviceType,
        ...deviceData.properties,
      },
    };

    // 更新地图数据源
    const source = window.mapInstance.getSource('test-points');
    if (source) {
      const currentData = source._data || {
        type: 'FeatureCollection',
        features: [],
      };
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
          ...deviceData.properties,
        },
      };

      // 添加到 points 数组
      this.points.push(newPoint);

      // 保存到 localStorage
      try {
        const existingPoints = JSON.parse(
          localStorage.getItem('mapPoints') || '[]'
        );
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
    try {
      // 只验证坐标是否为空或undefined
      const isValid = lat != null && lon != null;

      if (!isValid) {
        console.warn('坐标验证失败: 坐标值为空', {
          lat,
          lon,
        });
      }

      return isValid;
    } catch (error) {
      console.error('坐标验证出错:', error);
      return false;
    }
  }

  // 修改设备数据处理逻辑
  async syncDevicesWithMap() {
    try {
      const features = this.deviceList
        .filter((device) => this.validateCoordinates(device.lat, device.lon))
        .map((device) => this.createFeature(device));

      // 记录设备坐标
      features.forEach((feature) => {
        const [lon, lat] = feature.geometry.coordinates;
        console.log(`设备 ${feature.properties.id} 坐标:`, {
          经度: lon,
          纬度: lat,
        });
      });

      const featureCollection = {
        type: 'FeatureCollection',
        features: features,
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

      features.forEach((feature) => {
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
          duration: 1000,
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
        转换后lon: lon,
      });

      return {
        ...response,
        lat: lat,
        lon: lon,
      };
    } catch (error) {
      console.error(`获取设备 ${deviceId} 详情失败:`, error);
      throw error;
    }
  }

  // 修改特征创建逻辑
  createFeature(device) {
    // 直接使用原始坐标，不进行转换
    const coordinates = [device.lon, device.lat];

    console.log(`设备 ${device.id} 的坐标:`, {
      设备名称: device.deviceName,
      坐标: coordinates,
    });

    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: coordinates,
      },
      properties: {
        id: device.id,
        name: device.deviceName || '',
        type: device.deviceType || '',
        region: device.region || '',
        status: device.deviceStatus || '',
        connectionStatus: device.connectionStatus || '',
        powerStatus: device.powerStatus || '',
      },
    };
  }

  // 添加获取设备数据的方法
  async fetchAndDisplayDevices() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('未找到登录令牌');
        return;
      }

      // 使用 deviceService 获取设备列表
      const { deviceService } = await import('@/api/fetch.js');

      // 修改请求路径
      const data = await deviceService.list({
        pageNum: 1,
        pageSize: 100000,
      });

      console.log('获取到的设备数据:', data);

      if (data.code === 200) {
        // 更新备列表
        this.deviceList = data.rows || [];

        // 触发设备更新事件
        const event = new CustomEvent('devices-updated', {
          detail: {
            devices: this.deviceList,
          },
        });
        window.dispatchEvent(event);

        // 如果地图已经初始化，立即显示设备
        if (window.mapInstance) {
          await this.syncDevicesWithMap();
        }
      } else {
        throw new Error(data.msg || '获取设备列表失败');
      }
    } catch (error) {
      console.error('获取设备数据失败:', error);
      if (error.message.includes('认证失败')) {
        // 如果是认证失败，跳转到登录页
        window.location.href = '/login';
      }
    }
  }

  // 添加验证多边形方法
  validatePolygon(polygon) {
    try {
      if (!polygon || !polygon.geometry || !polygon.geometry.coordinates) {
        console.error('无效的多边形数据');
        return false;
      }

      const coords = polygon.geometry.coordinates[0];
      if (!coords || coords.length < 4) {
        console.error('多边形坐标点数不足');
        return false;
      }

      // 检查坐标值是否有效
      return coords.every((coord) => {
        const [lon, lat] = coord;
        return (
          typeof lon === 'number' &&
          typeof lat === 'number' &&
          !isNaN(lon) &&
          !isNaN(lat) &&
          lon >= -180 &&
          lon <= 180 &&
          lat >= -90 &&
          lat <= 90
        );
      });
    } catch (error) {
      console.error('验证多边形失败:', error);
      return false;
    }
  }

  // 添加授时处理方法
  handleTiming() {
    // 这里添加授时逻辑
    console.log('执行授时操作');
    alert('授时功能待实现');
  }
}

customElements.define('home-page', HomePage);
