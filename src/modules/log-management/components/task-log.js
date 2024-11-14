import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/task-log.css?inline';

class TaskLog extends LitElement {
  static styles = css`${unsafeCSS(styles)}`;

  render() {
    return html`
      <div class="modal">
        <div class="header">
          任务日志查询<button class="close-button" @click="${this.closeModal}">
            ×
          </button>
        </div>
        <hr />
        <div class="form-container">
          <div class="form-group">
            <label for="search-type">日志查询方式:</label>
            <select id="search-type" style="background-color: gray;">
              <option>日志类型</option>
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
                <th>任务详情</th>
                <th>故障详情</th>
                <th>日志详情</th>
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
    const taskLog = [
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        logType: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        logType: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        logType: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        logType: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        logType: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        logType: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        logType: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        logType: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        logType: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        logType: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        logType: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        logType: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        logType: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        logType: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        logType: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        logType: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        logType: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        logType: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        logType: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        logType: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        logType: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        logType: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        logType: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        logType: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        logType: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
      },
    ];

    return taskLog.map(
      (taskLog) => html`
      <tr class="table-row">
        <td>${taskLog.logId}</a></td>
        <td>${taskLog.logTime}</td>
        <td>${taskLog.userName}</td>
        <td>${taskLog.logType}</td>
        <td>${taskLog.region}</td>
        <td>${taskLog.deviceType}</td>
        <td><a @click="${() => this.openTaskDetails()}">查看</a></td>
        <td><a @click="${() => this.openFaultDetails()}">查看</a></td>
        <td><a @click="${() => this.openTaskLog()}">查看</a></td>
      </tr>
    `
    );
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
  openTaskDetails() {
    this.dispatchEvent(new CustomEvent('open-task-details'));
  }

  openFaultDetails() {
    this.dispatchEvent(new CustomEvent('open-fault-details'));
  }
  openTaskLog() {
    this.dispatchEvent(new CustomEvent('open-task-log-component'));
  }
}

customElements.define('task-log', TaskLog);
