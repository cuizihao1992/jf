import { LitElement, html, css } from 'lit';

class PostureAdjust extends LitElement {
  static styles = css`
    .modal {
      padding: 20px;
      background: rgba(0, 9, 36, 0.8);
      color: white;
      border-radius: 8px;
      width: 400px;
      height: 700px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      border: 1px solid #00ffff;
      background-size: cover;
      background-position: center;
    }

    .header {
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
      color: #00ffff;
    }

    .controls,
    .status-controls,
    .log-section {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .controls button,
    .status-controls button {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 5px 9px;
      cursor: pointer;
      border-radius: 5px;
      margin-left: 5px;
    }

    .controls button.active,
    .status-controls button.active {
      background-color: #ff00ff;
    }

    input[type='text'] {
      width: 225px;
      text-align: center;
      margin: 0 5px;
      background-color: #273d66;
      border: 1px solid #00ffff;
      color: white;
    }

    .close-button {
      cursor: pointer;
      color: white;
      background: none;
      border: none;
      font-size: 25px;
      font-weight: bold;
      float: right;
    }

    .control-section {
      display: flex;
      justify-content: space-between;
    }

    .switch-group {
      border: 1px solid #00ffff;
      padding: 10px;
      border-radius: 5px;
      margin-right: 25px;
      position: relative;
    }

    .switch-group:last-child {
      margin-right: 0;
    }

    .switch-group button {
      width: 40px;
    }

    .switch-label {
      position: absolute;
      top: -15px;
      left: 50%;
      transform: translateX(-50%);
      white-space: nowrap;
      background-color: rgb(8 15 37);
    }

    .device-time {
      border: 1px solid #00ffff;
      padding: 10px;
      border-radius: 5px;
      width: 409px;
      position: relative;
    }

    .time-label {
      position: absolute;
      top: -15px;
      left: 15.8%;
      transform: translateX(-50%);
      white-space: nowrap;
      background-color: rgb(8 15 37);
    }

    .time-content {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .posture-control {
      border: 1px solid #00ffff;
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 10px;
      width: 378px;
      position: relative;
      flex-direction: column;
    }

    .posture-label {
      position: absolute;
      top: -15px;
      left: 16%;
      transform: translateX(-50%);
      background-color: rgb(8 15 37);
    }

    .posture-calc-btn {
      margin-top: 5px;
      width: 75px;
      height: 32px;
      margin-bottom: 10px;
      margin-left: 302px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

    .posture-content {
      display: flex;
      justify-content: space-between;
    }

    .install-posture {
      border: 1px solid #00ffff;
      padding: 10px;
      border-radius: 5px;
      width: 120px;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-right: 5px;
    }

    .adjust-posture {
      border: 1px solid #00ffff;
      padding: 10px;
      border-radius: 5px;
      width: 200px;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .angle-row {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
    }

    .angle-row:last-child {
      margin-bottom: 0;
    }

    .angle-row input {
      width: 40px;
    }

    .command-btn {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 5px 9px;
      cursor: pointer;
      border-radius: 5px;
      margin-left: 3px;
    }

    .angle-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .function-buttons {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .control-btn {
      width: 65px;
      height: 32px;
      font-size: 11px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

    .table-container {
      max-height: 250px;
      overflow-y: auto;
    }

    .log-table {
      width: 100%;
      font-size: 14px;
      border-collapse: collapse;
    }

    .log-table th,
    .log-table td {
      border: 1px solid #444;
      padding: 8px;
      text-align: center;
    }

    .log-table th {
      background-color: #1a2b4c;
    }

    .log-table td {
      background-color: #273d66;
    }
  `;

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
                  <label>方位角：</label
                  ><input type="text" value="0°" readonly />
                </div>
                <div class="angle-row">
                  <label>俯仰角：</label
                  ><input type="text" value="0°" readonly />
                </div>
              </div>
            </div>
            <div class="adjust-posture">
              <div class="switch-label">调整姿态</div>
              <div class="angle-container">
                <div class="angle-row">
                  <label>水平角：</label>
                  <input type="text" value="-15.8°" readonly />
                  <button class="command-btn">下达指令</button>
                </div>
                <div class="angle-row">
                  <label>俯仰角：</label>
                  <input type="text" value="9.8°" readonly />
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
}

customElements.define('posture-adjust', PostureAdjust);
