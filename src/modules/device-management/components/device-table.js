import { LitElement, html, css } from 'lit';

export class DeviceTable extends LitElement {
  static properties = {
    devices: { type: Array },
    actions: { type: Array }, // 支持的操作列表（查看、编辑、删除）
  };

  constructor() {
    super();
    this.devices = [];
    this.actions = ['view', 'edit', 'delete'];
  }

  static styles = css`
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th,
    td {
      padding: 10px;
      border: 1px solid #ccc;
      text-align: left;
    }
    .actions a {
      margin-right: 10px;
      cursor: pointer;
    }
  `;

  render() {
    return html`
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
            ${this.actions.length ? html`<th>操作</th>` : ''}
          </tr>
        </thead>
        <tbody>
          ${this.devices.map((device) => this.renderRow(device))}
        </tbody>
      </table>
    `;
  }

  renderRow(device) {
    return html`
      <tr>
        <td>${device.id}</td>
        <td>${device.lastSyncTime}</td>
        <td>${device.deviceType}</td>
        <td>${device.region}</td>
        <td>${device.connectionStatus}</td>
        <td>${device.powerStatus}</td>
        <td>${device.deviceStatus}</td>
        <td class="actions">
          ${this.actions.includes('view')
            ? html`<a @click="${() => this._emitAction('view', device)}"
                >查看</a
              >`
            : ''}
          ${this.actions.includes('edit')
            ? html`<a @click="${() => this._emitAction('edit', device)}"
                >编辑</a
              >`
            : ''}
          ${this.actions.includes('delete')
            ? html`<a @click="${() => this._emitAction('delete', device)}"
                >删除</a
              >`
            : ''}
        </td>
      </tr>
    `;
  }

  _emitAction(action, device) {
    this.dispatchEvent(
      new CustomEvent(`device-${action}`, { detail: { device } })
    );
  }
}

customElements.define('device-table', DeviceTable);
