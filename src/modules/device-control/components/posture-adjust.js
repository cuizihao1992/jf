import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/posture-adjust.css?inline';
import { deviceService } from '@/api/fetch.js';

class PostureAdjust extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  static properties = {
    horizontalAngle: { type: String },
    pitchAngle: { type: String },
    deviceData: { type: Object },
    currentTime: { type: String },
    switchStates: { type: Object },
  };

  constructor() {
    super();
    this.horizontalAngle = '0';
    this.pitchAngle = '0';
    this.deviceData = {};
    this.currentTime = this.getCurrentTime();

    this.timeInterval = setInterval(() => {
      this.currentTime = this.getCurrentTime();
    }, 1000);

    this.boundUpdateDevice = this.handleDeviceUpdate.bind(this);
    window.addEventListener('update-posture-device', this.boundUpdateDevice);

    this.switchStates = {
      main: true, // 总开关
      platform: false, // 云台
      controller: false, // 工控机
    };

    this.boundUpdateAngles = this.handleAnglesUpdate.bind(this);
    window.addEventListener('update-posture-angles', this.boundUpdateAngles);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
    window.removeEventListener('update-posture-device', this.boundUpdateDevice);
    window.removeEventListener('update-posture-angles', this.boundUpdateAngles);
  }

  handleDeviceUpdate(e) {
    if (e.detail.device) {
      console.log('接收到设备数据:', e.detail.device);
      this.deviceData = e.detail.device;
      this.requestUpdate();
    }
  }

  handleAnglesUpdate(event) {
    const { deviceId, azimuth, elevation } = event.detail;
    
    if (this.deviceData.id === deviceId) {
      console.log('姿态调整组件收到角度更新:', {
        设备ID: deviceId,
        方位角: azimuth,
        俯仰角: elevation
      });
      
      this.horizontalAngle = azimuth;
      this.pitchAngle = elevation;
      this.requestUpdate();
    }
  }

  async fetchDeviceData(deviceId) {
    try {
      const data = await deviceService.getInfo(deviceId);
      this.deviceData = data;
      this.horizontalAngle = data.currentAzimuth?.toString() || '';
      this.pitchAngle = data.currentElevation?.toString() || '';
      this.requestUpdate();
    } catch (error) {
      console.error('获取设备数据失败:', error);
    }
  }

  render() {
    console.log('渲染姿态调整组件，当前设备数据:', this.deviceData);
    return html`
      <div class="modal">
        <button class="close-button" @click="${this.closeModal}">×</button>
        <div class="header">姿态调整</div>

        <div class="controls">
          <div>
            <label>设备编号：</label>
            <input
              type="text"
              .value="${this.deviceData?.ytsbh || ''}"
              readonly
            />
          </div>
        </div>

        <div class="controls">
          <div class="control-section">
            <div class="switch-group">
              <div class="switch-label">总开关</div>
              <button
                class="${this.switchStates.main ? 'active' : ''}"
                @click="${() => this.toggleSwitch('main', true)}"
              >
                开
              </button>
              <button
                class="${!this.switchStates.main ? 'active' : ''}"
                @click="${() => this.toggleSwitch('main', false)}"
              >
                关
              </button>
            </div>
            <div class="switch-group">
              <div class="switch-label">云台</div>
              <button
                class="${this.switchStates.platform ? 'active' : ''}"
                @click="${() => this.toggleSwitch('platform', true)}"
                ?disabled="${!this.switchStates.main}"
              >
                开
              </button>
              <button
                class="${!this.switchStates.platform ? 'active' : ''}"
                @click="${() => this.toggleSwitch('platform', false)}"
                ?disabled="${!this.switchStates.main}"
              >
                关
              </button>
            </div>
            <div class="switch-group">
              <div class="switch-label">工控机</div>
              <button
                class="${this.switchStates.controller ? 'active' : ''}"
                @click="${() => this.toggleSwitch('controller', true)}"
                ?disabled="${!this.switchStates.main}"
              >
                开
              </button>
              <button
                class="${!this.switchStates.controller ? 'active' : ''}"
                @click="${() => this.toggleSwitch('controller', false)}"
                ?disabled="${!this.switchStates.main}"
              >
                关
              </button>
            </div>
          </div>
        </div>

        <div class="controls">
          <div class="device-time">
            <div class="time-label">设备时间</div>
            <div class="time-content">
              <input type="text" .value="${this.currentTime}" readonly />
              <button @click="${this.getDeviceTime}">获取</button>
              <button @click="${this.syncDeviceTime}">校时</button>
            </div>
          </div>
        </div>

        <div class="posture-control">
          <div class="posture-label">姿态控制</div>
          <button
            @click="${() => this.openParameterConfig()}"
            class="posture-calc-btn"
          >
            姿态计算
          </button>
          <div class="posture-content">
            <div class="install-posture">
              <div class="switch-label">安装姿态</div>
              <div class="angle-container">
                <div class="angle-row">
                  <label>方位角：</label>
                  <input
                    type="text"
                    .value="${this.deviceData?.currentAzimuth || '0'}°"
                    readonly
                  />
                </div>
                <div class="angle-row">
                  <label>俯仰角：</label>
                  <input
                    type="text"
                    .value="${this.deviceData?.currentElevation || '0'}°"
                    readonly
                  />
                </div>
              </div>
            </div>
            <div class="adjust-posture">
              <div class="switch-label">调整姿态</div>
              <div class="angle-container">
                <div class="angle-row">
                  <label>水平角：</label>
                  <input
                    type="text"
                    .value="${this.horizontalAngle}°"
                    readonly
                  />
                  <button
                    class="command-btn"
                    @click="${() => this.sendCommand('horizontal')}"
                  >
                    下达指令
                  </button>
                </div>
                <div class="angle-row">
                  <label>俯仰角：</label>
                  <input type="text" .value="${this.pitchAngle}°" readonly />
                  <button
                    class="command-btn"
                    @click="${() => this.sendCommand('pitch')}"
                  >
                    下达指令
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="function-buttons">
          <button class="control-btn">云台角度</button>
          <button class="control-btn">GNSS</button>
          <button class="control-btn">电源信息</button>
          <button
            class="control-btn"
            @click="${() => this.openRealtimeImagery()}"
          >
            实时影像
          </button>
          <button
            class="control-btn"
            @click="${() => this.openAngleDetection()}"
          >
            角度检测
          </button>
          <button
            class="control-btn"
            @click="${() => this.openSingleDeviceLog()}"
          >
            设备日志
          </button>
        </div>

        <div class="table-container">
          <table class="log-table">
            <thead>
              <tr>
                <th>时间</th>
                <th>设备编号</th>
                <th>操作信息</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    `;
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }

  openRealtimeImagery() {
    this.dispatchEvent(new CustomEvent('open-realtime-imagery'));
  }

  openAngleDetection() {
    this.dispatchEvent(new CustomEvent('open-angle-detection'));
  }

  openSingleDeviceLog() {
    this.dispatchEvent(new CustomEvent('open-single-device-log'));
  }

  openParameterConfig() {
    window.currentDeviceData = this.deviceData;
    
    console.log('打开参数配置，当前设备安装姿态:', {
      方位角: this.deviceData?.currentAzimuth,
      俯仰角: this.deviceData?.currentElevation
    });
    
    this.dispatchEvent(new CustomEvent('open-parameter-config'));
  }

  async updateDeviceAngles(azimuth, elevation) {
    try {
      const updateData = {
        id: this.deviceData.id,
        currentAzimuth: azimuth,
        currentElevation: elevation,
      };
      await deviceService.update(updateData);
      this.horizontalAngle = azimuth.toString();
      this.pitchAngle = elevation.toString();
      this.requestUpdate();
    } catch (error) {
      console.error('更新设备角度失败:', error);
    }
  }

  updateAngles(azimuth, elevation) {
    console.log('接收到计算的角度差值:', { azimuth, elevation });
    this.horizontalAngle = azimuth;
    this.pitchAngle = elevation;
    this.requestUpdate();
  }

  async sendCommand(type) {
    try {
      const angle =
        type === 'horizontal' ? this.horizontalAngle : this.pitchAngle;
      console.log(
        `发送${type === 'horizontal' ? '水平' : '俯仰'}角调整指令:`,
        angle
      );

      // 这里可以添加发送指令到后端的逻辑
      // await deviceService.sendAngleCommand({
      //   deviceId: this.deviceData.id,
      //   type: type,
      //   angle: angle
      // });

      // 暂时用alert模拟
      alert(
        `已发送${type === 'horizontal' ? '水平' : '俯仰'}角调整指令：${angle}°`
      );
    } catch (error) {
      console.error('发送角度调整指令失败:', error);
      alert('发送指令失败');
    }
  }

  getCurrentTime() {
    const now = new Date();
    return now.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  }

  async getDeviceTime() {
    try {
      // 这里可以添加获取设备实际时间的接口调用
      // const response = await deviceService.getDeviceTime(this.deviceData.id);
      // this.currentTime = response.time;
      alert('获取设备时间功能待实现');
    } catch (error) {
      console.error('获取设备时间失败:', error);
      alert('获取设备时间失败');
    }
  }

  async syncDeviceTime() {
    try {
      // 这里可以添加设备校时的接口调用
      // await deviceService.syncDeviceTime({
      //   deviceId: this.deviceData.id,
      //   time: this.currentTime
      // });
      alert('校时功能待实现');
    } catch (error) {
      console.error('设备校时失败:', error);
      alert('设备校时失败');
    }
  }

  toggleSwitch(type, state) {
    console.log(`切换${type}开关到:`, state);

    if (type === 'main' && !state) {
      this.switchStates = {
        main: false,
        platform: false,
        controller: false,
      };
    } else {
      if (!this.switchStates.main && type !== 'main') {
        alert('请先打开总开关');
        return;
      }
      this.switchStates = {
        ...this.switchStates,
        [type]: state,
      };
    }

    this.requestUpdate();
  }

  async sendSwitchCommand(type, state) {
    try {
      console.log(`发送${type}开关命令:`, state);
    } catch (error) {
      this.switchStates[type] = !state;
      this.requestUpdate();
      alert('发送命令失败');
    }
  }
}

customElements.define('posture-adjust', PostureAdjust);
