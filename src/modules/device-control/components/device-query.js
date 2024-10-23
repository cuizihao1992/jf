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
      height: 700px; /* 设置高度为600px */
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      opacity: 0.9;
      border: 1px solid rgba(42, 130, 228, 1);
      overflow-y: auto; /* 添加垂直滚动条以防止内容溢出 */
    }

    .header {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px; /* 减少下边距以避免重叠 */
      text-align: left; /* 标题居中对齐 */
    }

    .header-divider {
      border-bottom: 1px solid #444; /* 添加横线 */
      margin-bottom: 10px; /* 横线与控件之间的间距 */
    }

    .controls {
      display: flex;
      flex-direction: column; /* 改为垂直布局 */
      margin-bottom: 20px;
    }

    .control-group {
      display: flex;
      justify-content: space-between; /* 控件之间的间距 */
      margin-bottom: 10px; /* 控件组之间的间距 */
      padding-bottom: 10px; /* 为每个控件组增加底部内边距 */
      border-bottom: 1px solid #444; /* 控件组的底部横线 */
    }

    .control-item {
      display: flex;
      align-items: center;
      flex: 1; /* 使控件等宽 */
      margin-right: 10px; /* 控件之间的右侧间距 */
    }

    .control-item:last-child {
      margin-right: 0; /* 最后一个控件不需要右侧间距 */
    }

    .control-item label {
      margin-right: 5px;
    }

    .control-item input,
    .control-item select {
      margin-left: 5px;
      padding: 5px;
      flex-grow: 1; /* 控件可以扩展以填满可用空间 */
      max-width: 200px; /* 限制输入框和选择框的最大宽度 */
    }

    .query-control {
      display: flex;
      align-items: center;
      flex: 0 1 auto; /* 控件的宽度可以自适应 */
    }

    .query-control select,
    .query-control input {
      margin-right: 10px; /* 控件之间的间距 */
      flex: 1; /* 使它们平分空间 */
      min-width: 150px; /* 设置最小宽度以保持可读性 */
      max-width: 250px; /* 设置最大宽度以避免铺满 */
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
      border-bottom: 2px solid #444; /* 添加表头的底部边框 */
    }

    .table-row {
      border-bottom: 1px solid #444; /* 每一行底部的横线 */
    }

    .table-row:last-child {
      border-bottom: none; /* 最后一行不需要底部边框 */
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
        <div class="header-divider"></div> <!-- 添加横线 -->
  
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
    // 确保姿态调整窗口存在并触发关闭事件
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
