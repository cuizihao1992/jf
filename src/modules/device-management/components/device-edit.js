import { LitElement, html, css } from 'lit';

class DeviceEdit extends LitElement { 
  static styles = css`
    .modal {
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
      background-size: cover;
      background-position: center;
    }

    .header {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
      text-align: left;
    }

    .form-container {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      margin-bottom: 20px;
    }
    .form-group {
      display: flex;
      align-items: center;
      margin-right: 20px;
    }
    .form-group label {
      margin-right: 10px;
      white-space: nowrap;
    }
    .form-group select,
    .form-group input {
      padding: 5px;
      background-color: #1b2a41;
      color: white;
      border: none;
      border-radius: 5px;
    }
    .query-button {
      padding: 8px 15px;
      background-color: #58a6ff;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      margin-left: 10px;
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
    .close-button {
      cursor: pointer;
      color: white;
      background: none;
      border: none;
      font-size: 25px;
      font-weight: bold;
      float: right;
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
        <div class="header">设备查询<button class="close-button" @click="${this.closeModal}">×</button></div><hr />
      <div class="form-container">
          <div class="form-group">
            <label for="search-type">任务查询类型:</label>
            <select id="search-type" style="background-color: gray;">
              <option>设备编号</option>
            </select>
          </div>
          <div class="form-group">
            <label for="search-condition">查询条件:</label>
            <input type="text" id="search-condition" style="background-color: white; " />
          </div>
          <button class="query-button">查询</button>
        </div><hr />
        <div class="form-container">
          <div class="form-group">
            <label for="location">所属地区:</label>
            <select id="location" style="background-color: gray;">
              <option>中卫</option>
            </select>
          </div>
          <div class="form-group">
            <label for="device-type">设备类型:</label>
            <select id="device-type" style="background-color: gray;">
              <option>自动角反射器</option>
            </select>
          </div>
          <div class="form-group">
            <label for="device-status">设备状态:</label>
            <select id="device-status" style="background-color: gray;">
              <option>关机</option>
            </select>
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
        <td>${device.id}</a></td>
        <td>${device.time}</td>
        <td>${device.type}</td>
        <td>${device.region}</td>
        <td>${device.status}</td>
        <td><span class="status-icon status-online">${device.power}</span></td>
        <td>${device.deviceStatus}</td>
        <td><a>查看</a>/<a>编辑</a>/<a>删除</a></td>
      </tr>
    `);
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
}

customElements.define('device-edit', DeviceEdit);