import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/device-log.css?inline';
import { deviceLogsService } from '@/api/fetch.js';

class DeviceLog extends LitElement {
  static styles = css`${unsafeCSS(styles)}`;
  
  static get properties() {
    return {
      deviceLogs: { type: Array }, // 添加设备日志属性
    };
  }

  constructor() {
    super();
    this.deviceLogs = [];
    this.fetchDeviceLogs(); // 初始化时获取设备日志
  }

  async fetchDeviceLogs() {
    try {
      const params = {
        pageNum: 1,
        pageSize: 100000,
        // 可以根据需要添加其他查询参数
      };
      const data = await deviceLogsService.list(params);
      this.deviceLogs = data.rows;
    } catch (error) {
      console.error('获取设备日志失败:', error);
    }
  }

  render() {
    return html`
      <div class="modal">
        <div class="header">
          设备日志查询<button class="close-button" @click="${this.closeModal}">
            ×
          </button>
        </div>
        <hr />
        <div class="form-container">
          <div class="form-group">
            <label for="search-type">日志查询方式:</label>
            <select id="search-type" style="background-color: gray;">
              <option>设备编号</option>
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
          <button class="query-button" @click="${this.fetchDeviceLogs}">
            查询
          </button>
        </div>
        <hr />
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
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>日志编号</th>
                <th>日志生成时间</th>
                <th>操作用户</th>
                <th>日志类型</th>
                <th>所属地区</th>
                <th>设备类型</th>
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
    return this.deviceLogs.map(
      (log) => html`
        <tr class="table-row">
          <td>${log.logId}</td>
          <td>${log.timestamp}</td>
          <td>${log.userId}</td>
          <td>${log.eventType}</td>
          <td>${log.region || '-'}</td>
          <td>${log.deviceType || '-'}</td>
          <td>${log.eventDescription}</td>
        </tr>
      `
    );
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
}

customElements.define('device-log', DeviceLog);
