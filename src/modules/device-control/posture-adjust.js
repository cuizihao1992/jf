import { LitElement, html, css } from 'lit';

class PostureAdjust extends LitElement {
  static styles = css`
    .modal {
      top: 50%;
      right: 5%;
      transform: translate(0%, -50%);
      position: fixed;
      padding: 20px;
      background-color: #0b1527;
      color: white;
      border-radius: 8px;
      width: 800px;
      height: 600px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      border: 1px solid #00ffff;
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
      margin-bottom: 10px;
    }

    .controls button, .status-controls button {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 5px 10px;
      cursor: pointer;
      border-radius: 5px;
      margin-left: 5px;
    }

    .controls button.active, .status-controls button.active {
      background-color: #ff00ff;
    }

    input[type="text"] {
      width: 50px;
      text-align: center;
      margin: 0 5px;
      background-color: #273d66; /* Darker background for inputs */
      border: 1px solid #00ffff; /* Cyan border for inputs */
      color: white;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      color: white;
      margin-top: 20px;
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

    .close-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: red;
      color: white;
      border: none;
      cursor: pointer;
      padding: 5px 10px;
      border-radius: 5px;
    }

    .status-controls .adjustment {
      display: flex;
      align-items: center;
    }

    .status-controls .adjustment label {
      margin-right: 5px;
    }

    .status-controls .adjustment input {
      width: 40px;
      margin-right: 5px;
    }

    .status-controls .adjustment button {
      margin-right: 10px;
    }

    .status-indicator {
      display: flex;
      justify-content: space-around;
      padding: 5px;
      background-color: #1a2b4c; /* Dark background for status indicators */
      border-radius: 5px;
    }

    .status-indicator div {
      color: #00ffff; /* Cyan text for indicators */
    }
  `;

  render() {
    return html`
      <div class="modal">
        <button class="close-btn" @click=${this.closeModal}>关闭</button>
        <div class="header">姿态调整</div>
        
        <div class="controls">
          <div>
            <label>设备编号：</label><input type="text" value="101" readonly />
          </div>
          <div>
            <label>电源控制：</label>
            <button class="active">开</button>
            <button>关</button>
            <button>云台开</button>
            <button>云台关</button>
            <button>工控机开</button>
            <button>工控机关</button>
          </div>
        </div>

        <div class="status-controls">
          <div>
            <label>设备时间：</label><input type="text" value="2024-9-24 16:21:50" readonly />
            <button>校时</button>
          </div>
          <div class="adjustment">
            <div>
              <label>安装姿态</label>
              <label>方位角：</label><input type="text" value="0°" readonly />
              <label>俯仰角：</label><input type="text" value="0°" readonly />
            </div>
            <div>
              <label>调整姿态</label>
              <label>水平角：</label><input type="text" value="-15.8°" readonly />
              <button>下达指令</button>
              <label>俯仰角：</label><input type="text" value="9.8°" readonly />
              <button>下达指令</button>
            </div>
          </div>
        </div>

        <div class="status-controls">
          <button>云台角度</button>
          <button>GNSS</button>
          <button>电源信息</button>
          <button>实时影像</button>
          <button>角度检测</button>
          <button>设备日志</button>
        </div>

        <div class="status-indicator">
          <div>云台角度: 297°</div>
          <div>电源信息: 47.52V</div>
          <div>角度检测: 87</div>
        </div>

        <table>
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
          </tbody>
        </table>
      </div>
    `;
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal')); // 触发关闭事件
  }
}

customElements.define('posture-adjust', PostureAdjust);