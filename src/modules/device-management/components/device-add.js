import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/device-add.css?inline';
import { deviceService } from '@/api/fetch.js';

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
          <div>
            <label>用户名:</label>
            <input
              type="text"
              .value="${this.userId}"
              @input="${(e) => (this.userId = e.target.value)}"
            />
          </div>
          <div>
            <label>设备类型:</label>
            <select
              .value="${this.deviceType}"
              @change="${(e) => (this.deviceType = e.target.value)}"
            >
              <option value="自动角反射器">自动角反射器</option>
            </select>
          </div>
          <div>
            <label>设备名:</label>
            <input
              type="text"
              .value="${this.deviceName}"
              @input="${(e) => (this.deviceName = e.target.value)}"
            />
          </div>
          <div>
            <label>磁偏角:</label>
            <input
              type="number"
              .value="${this.cpj}"
              @input="${(e) => (this.cpj = parseFloat(e.target.value))}"
            />
          </div>
          <div>
            <label>所属区域:</label>
            <select
              .value="${this.region}"
              @change="${(e) => (this.region = e.target.value)}"
            >
              <option value="中卫">中卫</option>
              <option value="银川">银川</option>
            </select>
          </div>

          <div>
            <label>云台设备号:</label>
            <input
              type="text"
              .value="${this.ytsbh}"
              @input="${(e) => (this.ytsbh = e.target.value)}"
            />
          </div>

          <div>
            <label>设备纬度:</label>
            <input
              type="number"
              .value="${this.lat}"
              @input="${(e) => (this.lat = parseFloat(e.target.value))}"
            />
          </div>
          <div>
            <label>设备经度:</label>
            <input
              type="number"
              .value="${this.lon}"
              @input="${(e) => (this.lon = parseFloat(e.target.value))}"
            />
          </div>

          <div class="row-end-time">
            <label for="end-time" style="display:inline-block;width:100px;"
              >方位角度:</label
            >
            <input
              type="number"
              .value="${this.currentAzimuth}"
              @input="${(e) =>
                (this.currentAzimuth = parseFloat(e.target.value))}"
            />
          </div>

          <div class="row-execution-time">
            <label
              for="execution-time-1"
              style="display:inline-block;width:100px;"
              >俯仰角度:</label
            >
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

    console.log('提交的数据:', param);

    // 假设 deviceService.add 是接口调用的方法
    deviceService
      .add(param)
      .then((response) => {
        console.log('设备添加成功:', response);
        this.dispatchEvent(new CustomEvent('close-modal')); // 关闭弹窗
      })
      .catch((error) => {
        console.error('设备添加失败:', error);
      });
  }

  // 关闭弹窗
  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
}

customElements.define('device-add', DeviceAdd);
