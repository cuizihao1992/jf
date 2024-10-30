import { LitElement, html, css } from 'lit';

class PostureAdjust extends LitElement {
  static styles = css`
    .modal {
      top: 45.7%;
      left: calc(50% + 300px);
      transform: translate(0%, -50%);
      position: fixed;
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

    .controls, .status-controls, .log-section {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .controls button, .status-controls button {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 5px 9px;
      cursor: pointer;
      border-radius: 5px;
      margin-left: 5px;
    }

    .controls button.active, .status-controls button.active {
      background-color: #ff00ff;
    }

    input[type="text"] {
      width: 225px;
      text-align: center;
      margin: 0 5px;
      background-color: #273d66;
      border: 1px solid #00ffff;
      color: white;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      color: white;
    }

    table, th, td {
      border: 1px solid #444;
    }

    th, td {
      padding: 8px;
      text-align: center;
    }

    th {
      background-color: #1a2b4c;
    }

    td {
      background-color: #273d66;
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

    .status-controls .adjustment {
      display: flex;
      align-items: center;
    }

    .status-controls .adjustment label {
      margin-right: -10px;
    }

    .status-controls .adjustment input {
      width: 40px;
      margin-right: 10px;
    }
    .table-container {
      max-height: 250px; /* 限制表格的最大高度 */
      overflow-y: auto; /* 仅表格内容滚动 */
    }
    .status-controls .adjustment button {
      margin-right: 10px;
    }

    .status-indicator {
      display: flex;
      justify-content: space-around;
      padding: 5px;
      background-color: #1a2b4c;
      border-radius: 5px;
    }

    .status-indicator div {
      color: #00ffff;
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
          <div class="control-section" style="display: flex; justify-content: space-between;">
            <div class="control-group" style="border: 1px solid #00ffff; padding: 10px; border-radius: 5px; margin-right: 25px; position: relative;">
              <div style="position: absolute; top: -15px; left: 50%; transform: translateX(-50%); white-space: nowrap;background-color: rgb(49, 56, 79);">总开关</div>
              <button class="active" style="width: 40px ">开</button>
              <button style="width: 40px">关</button>
            </div>
            <div class="control-group" style="border: 1px solid #00ffff; padding: 10px; border-radius: 5px; margin-right: 25px; position: relative;">
              <div style="position: absolute; top: -15px; left: 50%; transform: translateX(-50%); white-space: nowrap;background-color: rgb(49, 56, 79);">云台</div>
              <button style="width: 40px">开</button>
              <button style="width: 40px">关</button>
            </div>
            <div class="control-group" style="border: 1px solid #00ffff; padding: 10px; border-radius: 5px; position: relative;">
              <div style="position: absolute; top: -15px; left: 50%; transform: translateX(-50%); white-space: nowrap;background-color: rgb(49, 56, 79);">工控机</div>
              <button style="width: 40px">开</button>
              <button style="width: 40px">关</button>
            </div>
          </div>
        </div>

        <div class="controls">
          <div class="control-group" style="border: 1px solid #00ffff; padding: 10px; border-radius: 5px; width: 409px; position: relative;">
            <div style="position: absolute; top: -15px; left: 15.8%; transform: translateX(-50%); white-space: nowrap;background-color: rgb(49, 56, 79);">设备时间</div>
            <div style="display: flex; justify-content: center;align-items: center;">
              <input type="text" value="2024-9-24 16:21:50" readonly />
              <button>校时</button>
            </div>
          </div>
        </div>

      <div class="status-controls" style="border: 1px solid #00ffff; padding: 10px; border-radius: 5px; margin-bottom: 10px; width: 378px; position: relative;flex-direction: column;">
        <div style="position: absolute; top: -15px; left: 16%; transform: translateX(-50%);background-color: rgb(49, 56, 79);">姿态控制</div>
          <button @click="${() => this.openParameterConfig()}" style="margin-top: 5px; width: 75px; height: 32px; margin-left: auto; margin-bottom: 10px;">姿态计算</button>
          <div style="display: flex; justify-content: space-between;">
            <div class="adjustment" style="border: 1px solid #00ffff; padding: 10px; border-radius: 5px; width: 120px; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; margin-right: 5px;">
              <div style="position: absolute; top: -15px; left: 40%; transform: translateX(-50%);background-color: rgb(49, 56, 79);">安装姿态</div>
              <div style="display: flex; flex-direction: column; align-items: center;">
                <div style="display: flex; align-items: center;">
                  <label>方位角：</label><input type="text" value="0°" readonly />
                </div>
                <div style="display: flex; align-items: center;">
                  <label>俯仰角：</label><input type="text" value="0°" readonly />
                </div>
              </div>
            </div>
            <div class="adjustment" style="border: 1px solid #00ffff; padding: 10px; border-radius: 5px; width: 220px; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center;">
              <div style="position: absolute; top: -15px; left: 26%; transform: translateX(-50%);background-color: rgb(49, 56, 79);">调整姿态</div>
              <div style="display: flex; flex-direction: column; align-items: center;">
                <div style="display: flex; align-items: center;margin-bottom: 5px;">
                  <label>水平角：</label><input type="text" value="-15.8°" readonly /><button style="margin-left: 3px;">下达指令</button>
                </div>
                <div style="display: flex; align-items: center;">
                  <label>俯仰角：</label><input type="text" value="9.8°" readonly /><button style=" margin-left: 3px;">下达指令</button>
                </div>
              </div>
            </div>
        </div>
      </div>

        <div class="status-controls">
          <button style="width: 65px; height: 32px; font-size: 11px; margin-left: 0px;">云台角度</button>
          <button style="width: 65px; height: 32px; font-size: 11px; ">GNSS</button>
          <button style="width: 65px; height: 32px; font-size: 11px; ">电源信息</button>
          <button @click="${() => this.openRealtimeImagery()}" style="width: 65px; height: 32px; font-size: 11px; ">实时影像</button>
          <button @click="${() => this.openAngleDetection()}" style="width: 65px; height: 32px; font-size: 11px; ">角度检测</button>
          <button @click="${() => this.openSingleDeviceLog()}" style="width: 65px; height: 32px; font-size: 11px; ">设备日志</button>
        </div>
        <div class="table-container">
        <table style="font-size: 14px;">
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