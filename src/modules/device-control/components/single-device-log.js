import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/single-device-log.css?inline';

class SingleDeviceLog extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  render() {
    return html`
      <div class="modal">
        <div class="header">
          设备日志<button class="close-button" @click="${this.closeModal}">
            ×
          </button>
        </div>
        <hr />
        <div class="form-container">
          <div class="form-group">
            <label for="search-type">日志查询方式:</label>
            <select id="search-type" style="background-color: gray;">
              <option>操作用户</option>
            </select>
          </div>
          <div class="form-group">
            <label for="search-condition">查询条件:</label>
            <input
              type="text"
              id="search-condition"
              style="background-color: white; "
            />
          </div>
          <button class="query-button">查询</button>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>日志编号</th>
                <th>日志生成时间</th>
                <th>操作用户</th>
                <th>设备编号</th>
                <th>所属地区</th>
                <th>操作内容</th>
              </tr>
            </thead>
            <tbody>
              ${this.renderRows()}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  renderRows() {
    const deviceLog = [
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        deviceId: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
        operationContent: '打开所有电源',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        deviceId: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
        operationContent: '打开所有电源',
      },
    ];

    return deviceLog.map(
      (deviceLog) => html`
      <tr class="table-row">
        <td>${deviceLog.logId}</a></td>
        <td>${deviceLog.logTime}</td>
        <td>${deviceLog.userName}</td>
        <td>${deviceLog.deviceId}</td>
        <td>${deviceLog.region}</td>
        <td>${deviceLog.operationContent}</td>
      </tr>
    `
    );
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
}

customElements.define('single-device-log', SingleDeviceLog);
