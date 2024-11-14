import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/posture-adjust.css?inline';

class PostureAdjust extends LitElement {
  static styles = css`${unsafeCSS(styles)}`;

  static properties = {
    horizontalAngle: { type: String },
    pitchAngle: { type: String }
  };

  constructor() {
    super();
    this.horizontalAngle = '';
    this.pitchAngle = '';
  }

  render() {
    return html`
      <div class="modal">
        <button class="close-button" @click="${this.closeModal}">×</button>
        <div class="header">姿态调整</div>

        <div class="controls">
          <div>
            <label>设备编号：</label><input type="text" value="101" readonly />
          </div>
        </div>

        <div class="controls">
          <div class="control-section">
            <div class="switch-group">
              <div class="switch-label">总开关</div>
              <button class="active">开</button>
              <button>关</button>
            </div>
            <div class="switch-group">
              <div class="switch-label">云台</div>
              <button>开</button>
              <button>关</button>
            </div>
            <div class="switch-group">
              <div class="switch-label">工控机</div>
              <button>开</button>
              <button>关</button>
            </div>
          </div>
        </div>

        <div class="controls">
          <div class="device-time">
            <div class="time-label">设备时间</div>
            <div class="time-content">
              <input type="text" value="2024-9-24 16:21:50" readonly />
              <button>获取</button>
              <button>校时</button>
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
                  <input type="text" value="0°" readonly />
                </div>
                <div class="angle-row">
                  <label>俯仰角：</label>
                  <input type="text" value="0°" readonly />
                </div>
              </div>
            </div>
            <div class="adjust-posture">
              <div class="switch-label">调整姿态</div>
              <div class="angle-container">
                <div class="angle-row">
                  <label>水平角：</label>
                  <input type="text" value="${this.horizontalAngle}°" readonly />
                  <button class="command-btn">下达指令</button>
                </div>
                <div class="angle-row">
                  <label>俯仰角：</label>
                  <input type="text" value="${this.pitchAngle}°" readonly />
                  <button class="command-btn">下达指令</button>
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
            <tbody>
              <tr>
                <td>2024-9-24 16:22:10</td>
                <td>101</td>
                <td>姿态调整成功</td>
              </tr>
              <tr>
                <td>2024-9-24 16:22:10</td>
                <td>101</td>
                <td>姿态调整成功</td>
              </tr>
              <tr>
                <td>2024-9-24 16:22:10</td>
                <td>101</td>
                <td>姿态调整成功</td>
              </tr>
              <tr>
                <td>2024-9-24 16:22:10</td>
                <td>101</td>
                <td>姿态调整成功</td>
              </tr>
              <tr>
                <td>2024-9-24 16:22:10</td>
                <td>101</td>
                <td>姿态调整成功</td>
              </tr>
              <tr>
                <td>2024-9-24 16:22:10</td>
                <td>101</td>
                <td>姿态调整成功</td>
              </tr>
              <tr>
                <td>2024-9-24 16:22:10</td>
                <td>101</td>
                <td>姿态调整成功</td>
              </tr>
              <tr>
                <td>2024-9-24 16:22:10</td>
                <td>101</td>
                <td>姿态调整成功</td>
              </tr>
            </tbody>
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
    this.dispatchEvent(new CustomEvent('open-parameter-config'));
  }

  updateAngles(azimuth, elevation) {
    this.horizontalAngle = azimuth;
    this.pitchAngle = elevation;
    this.requestUpdate();
  }
}

customElements.define('posture-adjust', PostureAdjust);