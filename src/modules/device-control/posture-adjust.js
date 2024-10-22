import { LitElement, html, css } from 'lit';

class PostureAdjust extends LitElement {
  static styles = css`
    .modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 20px;
      background-color: #0b1527;
      color: white;
      border-radius: 8px;
      width: 800px;
      height: 600px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .header {
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 20px;
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
  `;

  render() {
    return html`
      <div class="modal">
        <button class="close-btn" @click=${this.closeModal}>关闭</button>
        <div class="header">姿态调整</div>
        
        <!-- 设备编号和电源控制 -->
        <div class="controls">
          <div>
            <label>设备编号：</label><input type="text" value="101" readonly />
          </div>
          <div>
            <label>电源控制：</label>
            <button>总开关</button>
            <button>云台开</button>
            <button>工控机开</button>
          </div>
        </div>

        <!-- 设备时间和姿态控制 -->
        <div class="status-controls">
          <div>
            <label>设备时间：</label><input type="text" value="2024-9-24 16:21:50" readonly />
          </div>
          <div>
            <label>姿态控制：</label>
            <label>方位角：</label><input type="text" value="0°" readonly />
            <label>俯仰角：</label><input type="text" value="0°" readonly />
          </div>
        </div>

        <!-- 状态查询按钮组 -->
        <div class="status-controls">
          <button>云台角度</button>
          <button>GNSS</button>
          <button>电源信息</button>
          <button>实时影像</button>
          <button>角度检测</button>
          <button>设备日志</button>
        </div>

        <!-- 操作信息表格 -->
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
            <!-- 更多行 -->
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
