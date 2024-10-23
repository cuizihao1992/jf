import { LitElement, html, css } from 'lit';

class DeviceQuery extends LitElement {
  static styles = css`
    .modal {
      position: fixed;
      top: 50%;
      left: 40%;
      transform: translate(-50%, -50%);
      padding: 20px;
      background: rgba(0, 9, 36, 0.8);
      color: white;
      border-radius: 10px;
      width: 900px;
      height: 700px; 
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      opacity: 1;
      border: 1px solid rgba(42, 130, 228, 1);
      overflow-y: auto;
      background-image: url('src/modules/device-control/img/鑳屾櫙-3.png');
      background-size: cover;
      background-position: center;
    }

    .header {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
      text-align: left;
    }

    .header-divider {
      border-bottom: 1px solid #444;
      margin-bottom: 10px;
    }

    .controls {
      display: flex;
      flex-direction: column;
      margin-bottom: 20px;
    }

    .control-group {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #444;
    }

    .control-item {
      display: flex;
      align-items: center;
      flex: 1;
      margin-right: 10px;
    }

    .control-item:last-child {
      margin-right: 0;
    }

    .control-item label {
      margin-right: 5px;
    }

    .control-item input,
    .control-item select {
      margin-left: 5px;
      padding: 5px;
      flex-grow: 1;
      max-width: 200px;
    }

    .query-control {
      display: flex;
      align-items: center;
      flex: 0 1 auto;
    }

    .query-control select,
    .query-control input {
      margin-right: 10px;
      flex: 1;
      min-width: 150px;
      max-width: 250px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      color: white;
      margin-top: 20px;
    }

    th {
      background-color: #1a2b4c;
      padding: 8px;
      text-align: center;
      border-bottom: 2px solid #444;
    }

    .table-row {
      border-bottom: 1px solid #444;
    }

    .table-row:last-child {
      border-bottom: none;
    }

    td {
      padding: 8px;
      text-align: center;
    }

    .status-icon {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 81px;
      height: 20px;
      border-radius: 5px;
      margin-right: 5px;
    }

    .status-online { background-color: green; }
    .status-warning { background-color: orange; }
    .status-offline { background-color: red; }

    a {
      color: #1e90ff;
      cursor: pointer;
      text-decoration: none;
    }
  `;

  render() {
    return html`
      <div class="modal">
        <button class="close-btn" @click=${this.closeModal} style="position: absolute; top: 10px; right: 10px; background-color: red; color: white; border: none; cursor: pointer; padding: 5px 10px; border-radius: 5px;">关闭</button>
        <div class="header">设备查询</div>
        <div class="header-divider"></div>
  
        <div class="controls">
          <div class="control-group">
            <div class="control-item">
              <label for="queryType">设备编号：</label>
              <select id="queryType">
                <option>设备编号</option>
              </select>
              <input type="text" placeholder="输入设备编号" style="margin-left: 5px;" />
              <button>查询</button>
            </div>
          </div>
          <div class="control-group">
            <div class="control-item">
              <label for="region">所属地区：</label>
              <select id="region">
                <option>中卫</option>
              </select>
            </div>
            <div class="control-item">
              <label for="deviceType">请选择类型：</label>
              <select id="deviceType">
                <option>自动角反射器</option>
              </select>
            </div>
            <div class="control-item">
              <label for="status">连接状态：</label>
              <select id="status">
                <option>在线</option>
              </select>
            </div>
          </div>
        </div>
  
        <table>
          <thead>
            <tr>
              <th>设备编号</th>
              <th>设备时间</th>
              <th>设备类型</th>
              <th>所属地区</th>
              <th>连接状态</th>
              <th>电源状态</th>
              <th>设备状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            ${this.renderRows()}
          </tbody>
        </table>
      </div>
    `;
  }

  renderRows() {
    const devices = [
      { id: 101, time: '2024-9-24 16:21:45', type: '自动角反射器', region: '中卫', status: '在线', power: '⚡', deviceStatus: '关机' },
      { id: 102, time: '2024-9-24 16:21:50', type: '自动角反射器', region: '中卫', status: '在线', power: '⚡', deviceStatus: '关机' },
      { id: 103, time: '2024-9-24 16:21:50', type: '自动角反射器', region: '中卫', status: '在线', power: '⚡', deviceStatus: '关机' },
      { id: 104, time: '2024-9-24 16:21:50', type: '自动角反射器', region: '中卫', status: '在线', power: '⚡', deviceStatus: '关机' },
    ];

    return devices.map(device => html`
      <tr class="table-row">
        <td><a href="#">${device.id}</a></td>
        <td>${device.time}</td>
        <td>${device.type}</td>
        <td>${device.region}</td>
        <td>${device.status}</td>
        <td><span class="status-icon status-online">${device.power}</span></td>
        <td>${device.deviceStatus}</td>
        <td><a @click=${this.adjustPosture}>姿态调整</a></td>
      </tr>
    `);
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
    const postureAdjustElement = document.querySelector('posture-adjust');
    if (postureAdjustElement) {
      postureAdjustElement.dispatchEvent(new CustomEvent('close-modal'));
    }
  }

  adjustPosture() {
    this.dispatchEvent(new CustomEvent('open-posture-adjust'));
  }
}

customElements.define('device-query', DeviceQuery);