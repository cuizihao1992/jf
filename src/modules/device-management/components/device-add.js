import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/device-add.css?inline';
import api from '@/apis/api.js';

class DeviceAdd extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;
  // 定义属性
  static get properties() {
    return {
      userId: { type: String },
      deviceName: { type: String },
      deviceType: { type: String },
      region: { type: String },
      ytsbh: { type: String },
      gkmkh: { type: String },
      cpj: { type: Number },
      lat: { type: Number },
      lon: { type: Number },
      installTime: { type: String },
      currentAzimuth: { type: String },
      currentElevation: { type: String },
      latDegrees: { type: Number },
      latMinutes: { type: Number },
      latSeconds: { type: Number },
      lonDegrees: { type: Number },
      lonMinutes: { type: Number },
      lonSeconds: { type: Number },
    };
  }

  // 初始化属性
  constructor() {
    super();
    this.userId = '';
    this.deviceName = '';
    this.deviceType = '';
    this.region = '';
    this.ytsbh = '';
    this.gkmkh = '';
    this.cpj = 0;
    this.lat = 0;
    this.lon = 0;
    this.installTime = '';
    this.currentAzimuth = 0;
    this.currentElevation = 0;
    this.latDegrees = 0;
    this.latMinutes = 0;
    this.latSeconds = 0;
    this.lonDegrees = 0;
    this.lonMinutes = 0;
    this.lonSeconds = 0;
  }

  // 修改坐标范围常量为度分秒格式
  static COORDINATE_RANGES = {
    SONGSHAN: {
      LAT: {
        MIN: { degrees: 34, minutes: 23, seconds: 31 },
        MAX: { degrees: 34, minutes: 35, seconds: 53 },
      },
      LON: {
        MIN: { degrees: 112, minutes: 56, seconds: 7 },
        MAX: { degrees: 113, minutes: 11, seconds: 32 },
      },
    },
    ZHONGWEI: {
      LAT: {
        MIN: { degrees: 36, minutes: 6, seconds: 0 },
        MAX: { degrees: 37, minutes: 50, seconds: 0 },
      },
      LON: {
        MIN: { degrees: 104, minutes: 17, seconds: 0 },
        MAX: { degrees: 106, minutes: 10, seconds: 0 },
      },
    },
  };

  // 添加度分秒比较方法
  compareDMS(dms1, dms2) {
    const total1 = dms1.degrees * 3600 + dms1.minutes * 60 + dms1.seconds;
    const total2 = dms2.degrees * 3600 + dms2.minutes * 60 + dms2.seconds;
    return total1 - total2;
  }

  // 添加 handleLocation 方法
  handleLocation(location) {
    const coordinates = {
      中卫: [106.2, 37.5],
      嵩山: [112.5, 34.8],
    };

    // 触发位置选择事件
    this.dispatchEvent(
      new CustomEvent('location-selected', {
        detail: {
          location,
          coordinates: coordinates[location],
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  // 修改检查坐标方法
  checkCoordinates() {
    // 检查是否所有经纬度字段都已输入
    const isLatComplete =
      this.latDegrees !== undefined &&
      this.latMinutes !== undefined &&
      this.latSeconds !== undefined;
    const isLonComplete =
      this.lonDegrees !== undefined &&
      this.lonMinutes !== undefined &&
      this.lonSeconds !== undefined;

    // 如果经纬度未完全输入，提示用户
    if (!isLatComplete || !isLonComplete) {
      alert('请完整输入经纬度信息');
      return;
    }

    const currentLat = {
      degrees: this.latDegrees,
      minutes: this.latMinutes,
      seconds: this.latSeconds,
    };

    const currentLon = {
      degrees: this.lonDegrees,
      minutes: this.lonMinutes,
      seconds: this.lonSeconds,
    };

    const { SONGSHAN, ZHONGWEI } = this.constructor.COORDINATE_RANGES;

    // 检查是否在嵩山范围内
    const inSongshanRange =
      this.compareDMS(currentLat, SONGSHAN.LAT.MIN) >= 0 &&
      this.compareDMS(currentLat, SONGSHAN.LAT.MAX) <= 0 &&
      this.compareDMS(currentLon, SONGSHAN.LON.MIN) >= 0 &&
      this.compareDMS(currentLon, SONGSHAN.LON.MAX) <= 0;

    // 检查是否在中卫范围内
    const inZhongweiRange =
      this.compareDMS(currentLat, ZHONGWEI.LAT.MIN) >= 0 &&
      this.compareDMS(currentLat, ZHONGWEI.LAT.MAX) <= 0 &&
      this.compareDMS(currentLon, ZHONGWEI.LON.MIN) >= 0 &&
      this.compareDMS(currentLon, ZHONGWEI.LON.MAX) <= 0;

    if (!inSongshanRange && !inZhongweiRange) {
      alert(
        '请输入有效范围内的经纬度！\n' +
          '嵩山定标场：北纬34°23′31″—34°35′53″，东经112°56′07″—113°11′32″\n' +
          '中卫定标场：北纬36°06′00″—37°50′00″，东经104°17′00″—106°10′00″'
      );
      return;
    }

    // 转换为十进制度用于地图显示
    const latitude = this.convertDMSToDecimal(
      this.latDegrees,
      this.latMinutes,
      this.latSeconds
    );
    const longitude = this.convertDMSToDecimal(
      this.lonDegrees,
      this.lonMinutes,
      this.lonSeconds
    );

    // 更新经纬度属性
    this.lat = latitude;
    this.lon = longitude;

    // 设置区域
    if (inSongshanRange) {
      this.region = '嵩山';
    } else if (inZhongweiRange) {
      this.region = '中卫';
    }

    // 创建一个Promise来处理地图操作
    const updateMapPromise = new Promise((resolve) => {
      // 先触发位置选择事件，进行地图跳转
      this.dispatchEvent(
        new CustomEvent('location-selected', {
          detail: {
            location: this.region,
            coordinates: [longitude, latitude],
          },
          bubbles: true,
          composed: true,
        })
      );

      // 添加点位到地图
      const point = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        properties: {
          id: 'new-device',
        },
      };

      this.dispatchEvent(
        new CustomEvent('add-map-point', {
          detail: { point },
          bubbles: true,
          composed: true,
        })
      );

      // 给地图操作留出足够的时间
      setTimeout(resolve, 1000);
    });

    // 等待地图操作完成后再显示提示
    updateMapPromise.then(() => {
      if (inSongshanRange) {
        alert(
          `当前位置处于嵩山定标场范围内\n` +
            `纬度：${this.latDegrees}°${this.latMinutes}′${this.latSeconds}″\n` +
            `经度：${this.lonDegrees}°${this.lonMinutes}′${this.lonSeconds}″`
        );
      } else if (inZhongweiRange) {
        alert(
          `当前位置处于中卫定标场范围内\n` +
            `纬度：${this.latDegrees}°${this.latMinutes}′${this.latSeconds}″\n` +
            `经度：${this.lonDegrees}°${this.lonMinutes}′${this.lonSeconds}″`
        );
      }
    });
  }

  // 添新的转换方法
  convertDMSToDecimal(degrees, minutes, seconds) {
    return degrees + minutes / 60 + seconds / 3600;
  }

  // 添加经纬度更新方法
  updateLatitude() {
    this.lat = this.convertDMSToDecimal(
      this.latDegrees,
      this.latMinutes,
      this.latSeconds
    );
    this.handleCoordinateChange();
  }

  updateLongitude() {
    this.lon = this.convertDMSToDecimal(
      this.lonDegrees,
      this.lonMinutes,
      this.lonSeconds
    );
    this.handleCoordinateChange();
  }

  // 渲染表单
  render() {
    return html`
      <div class="modal">
        <div class="header">
          新增设备
          <button class="close-button" @click="${this.closeModal}">×</button>
        </div>
        <div class="task-info">
          <h2>设备信息</h2>
          <hr
            style="width: 395px; height:0px; border:none; border-top:1px solid #58a6ff; margin: -5px 0 10px 0;"
          />
          <div class="row-task">
            <label>设备名:</label>
            <input
              type="text"
              .value="${this.deviceName}"
              @input="${(e) => (this.deviceName = e.target.value)}"
            />
          </div>
           <div class="row-task">
            <label>设备编号:</label>
            <input
              type="text"
              .value="${this.ytsbh}"
              @input="${(e) => (this.ytsbh = e.target.value)}"
            />
          </div>
          <div>
            <label>设备类型:</label>
            <select
              .value="${this.deviceType}"
              @change="${(e) => (this.deviceType = e.target.value)}"
            >
              <option value="自动角反射器">自动角射器</option>
            </select>
          </div>
          <div>
            <label>所属区域:</label>
            <select
              .value="${this.region}"
              @change="${(e) => {
                this.region = e.target.value;
                this.handleLocation(e.target.value);
              }}"
            >
              <option value="中卫">中卫</option>
              <option value="嵩山">嵩山</option>
            </select>
          </div>
          <h2>安装信息</h2>
          <hr
            style="width: 395px; height:0px; border:none; border-top:1px solid #58a6ff; margin: -5px 0 10px 0;"
          />
          <div>
            <label>磁偏角:</label>
            <input
              type="number"
              .value="${this.cpj}"
              @input="${(e) => (this.cpj = parseFloat(e.target.value))}"
            />
          </div>

          <div class="coordinate-section">
            <div class="coordinate-inputs">
              <div class="coordinate-input">
                <label>设备纬度:</label>
                <div class="dms-input">
                  <div class="dms-group">
                    <input
                      type="number"
                      min="-90"
                      max="90"
                      .value="${this.latDegrees}"
                      @input="${(e) => {
                        this.latDegrees = parseInt(e.target.value) || 0;
                      }}"
                    />
                    <span>°</span>
                  </div>
                  <div class="dms-group">
                    <input
                      type="number"
                      min="0"
                      max="59"
                      .value="${this.latMinutes}"
                      @input="${(e) => {
                        this.latMinutes = parseInt(e.target.value) || 0;
                      }}"
                    />
                    <span>′</span>
                  </div>
                  <div class="dms-group">
                    <input
                      type="number"
                      min="0"
                      max="59.99"
                      step="0.01"
                      .value="${this.latSeconds}"
                      @input="${(e) => {
                        this.latSeconds = parseFloat(e.target.value) || 0;
                      }}"
                    />
                    <span>″</span>
                  </div>
                </div>
              </div>

              <div class="coordinate-input">
                <label>设备经度:</label>
                <div class="dms-input">
                  <div class="dms-group">
                    <input
                      type="number"
                      min="-180"
                      max="180"
                      .value="${this.lonDegrees}"
                      @input="${(e) => {
                        this.lonDegrees = parseInt(e.target.value) || 0;
                      }}"
                    />
                    <span>°</span>
                  </div>
                  <div class="dms-group">
                    <input
                      type="number"
                      min="0"
                      max="59"
                      .value="${this.lonMinutes}"
                      @input="${(e) => {
                        this.lonMinutes = parseInt(e.target.value) || 0;
                      }}"
                    />
                    <span>′</span>
                  </div>
                  <div class="dms-group">
                    <input
                      type="number"
                      min="0"
                      max="59.99"
                      step="0.01"
                      .value="${this.lonSeconds}"
                      @input="${(e) => {
                        this.lonSeconds = parseFloat(e.target.value) || 0;
                      }}"
                    />
                    <span>″</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              class="check-coordinates-btn"
              @click="${this.checkCoordinates}"
            >
              跳转
            </button>
          </div>

          <div>
            <label>方位向:</label>
            <input
              type="number"
              .value="${this.currentAzimuth}"
              @input="${(e) =>
                (this.currentAzimuth = parseFloat(e.target.value))}"
            />
          </div>

          <div>
            <label>俯仰向:</label>
            <input
              type="number"
              .value="${this.currentElevation}"
              @input="${(e) =>
                (this.currentElevation = parseFloat(e.target.value))}"
            />
          </div>
          <div>
            <label>安装时间:</label>
            <input
              type="datetime-local"
              .value="${this.installTime}"
              @input="${(e) => (this.installTime = e.target.value)}"
            />
          </div>
        </div>
        <div class="button-group" style="margin-top: 15px;">
          <button class="action-button" @click="${this.submit}">提交</button>
          <button class="action-button" @click="${this.closeModal}">
            取消
          </button>
        </div>
      </div>
    `;
  }

  // 提交表单
  submit() {
    const param = {
      userId: this.userId,
      deviceName: this.deviceName,
      deviceType: this.deviceType,
      region: this.region,
      ytsbh: this.ytsbh,
      gkmkh: this.gkmkh,
      cpj: this.cpj,
      lat: this.lat,
      lon: this.lon,
      installTime: this.installTime,
      currentAzimuth: this.currentAzimuth,
      currentElevation: this.currentElevation,
    };

    api.devicesApi
      .add(param)
      .then((response) => {
        console.log('添加设备成功:', response);
        this.dispatchEvent(new CustomEvent('close-modal')); // 关闭弹窗
        console.log('提交的数据:', param);
        showToast({
          message: '设备添加成功！',
          type: 'success',
          duration: 3000,
        });
        this.dispatchEvent(
          new CustomEvent('clear-temp-marker', {
            detail: { id: 'new-device' },
            bubbles: true,
            composed: true,
          })
        );

        // 创建新设备的点位数据
        const newDevice = {
          ...param,
          id: response.data?.id || response.id || Date.now().toString(), // 添加后备ID生成
          deviceStatus: '正常',
          connectionStatus: '已连接',
          powerStatus: '开机',
        };

        console.log('新增设备数据:', newDevice);

        // 触发设备更新事件，将新设备添加到地图
        window.dispatchEvent(
          new CustomEvent('devices-updated', {
            detail: {
              devices: [newDevice],
            },
            bubbles: true,
            composed: true,
          })
        );

        // 定位到新添加的设备位置
        window.dispatchEvent(
          new CustomEvent('locate-device', {
            detail: {
              deviceId: newDevice.id,
              deviceName: newDevice.deviceName,
              lat: newDevice.lat,
              lon: newDevice.lon,
            },
            bubbles: true,
            composed: true,
          })
        );

        // 关闭弹窗
        this.dispatchEvent(new CustomEvent('close-modal'));
      })
      .catch((error) => {
        console.error('添加设备失败:', error);
        showToast({ message: '添加设备失败', type: 'error', duration: 3000 });
      });
    return;
  }

  // 修改 closeModal 方法
  closeModal() {
    // 清除临时点位
    this.dispatchEvent(
      new CustomEvent('clear-temp-marker', {
        detail: {
          id: 'new-device', // 只清除临时点位的ID
        },
        bubbles: true,
        composed: true,
      })
    );

    // 重置地图视图到初始位置
    this.dispatchEvent(
      new CustomEvent('reset-map-view', {
        detail: {
          center: [116.397428, 39.90923], // 北京为初始中心点
          zoom: 12, // 初始缩放级别
        },
        bubbles: true,
        composed: true,
      })
    );

    // 关闭弹窗
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
}

customElements.define('device-add', DeviceAdd);
