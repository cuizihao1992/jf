import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/status-mission.css?inline';

class StatusMission extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  static properties = {
    tasks: { type: Array },
    sortDirection: { type: String },
  };

  constructor() {
    super();
    this.sortDirection = 'asc'; // 初始排序方向
    this.tasks = [
      {
        name: '中卫101',
        code: 'w101',
        status: '执行中',
        startTime: '2024-10-10 16:00:00',
        endTime: '2024-10-10 16:40:00',
      },
      {
        name: '中卫102',
        code: 'w102',
        status: '待执行',
        startTime: '2024-10-15 16:00:00',
        endTime: '2024-10-15 16:40:00',
      },
      {
        name: '中卫102',
        code: 'w102',
        status: '待执行',
        startTime: '2024-10-15 16:00:00',
        endTime: '2024-10-15 16:40:00',
      },
      {
        name: '中卫102',
        code: 'w102',
        status: '待执行',
        startTime: '2024-10-15 16:00:00',
        endTime: '2024-10-15 16:40:00',
      },
      {
        name: '中卫102',
        code: 'w102',
        status: '待执行',
        startTime: '2024-10-15 16:00:00',
        endTime: '2024-10-15 16:40:00',
      },
      {
        name: '中卫102',
        code: 'w102',
        status: '待执行',
        startTime: '2024-10-15 16:00:00',
        endTime: '2024-10-15 16:40:00',
      },
      {
        name: '中卫102',
        code: 'w102',
        status: '待执行',
        startTime: '2024-10-15 16:00:00',
        endTime: '2024-10-15 16:40:00',
      },
      {
        name: '中卫102',
        code: 'w102',
        status: '待执行',
        startTime: '2024-10-15 16:00:00',
        endTime: '2024-10-15 16:40:00',
      },
      {
        name: '中卫102',
        code: 'w102',
        status: '待执行',
        startTime: '2024-10-15 16:00:00',
        endTime: '2024-10-15 16:40:00',
      },
      {
        name: '中卫102',
        code: 'w102',
        status: '待执行',
        startTime: '2024-10-15 16:00:00',
        endTime: '2024-10-15 16:40:00',
      },
      {
        name: '中卫102',
        code: 'w102',
        status: '待执行',
        startTime: '2024-10-15 16:00:00',
        endTime: '2024-10-15 16:40:00',
      },
      {
        name: '中卫102',
        code: 'w102',
        status: '待执行',
        startTime: '2024-10-15 16:00:00',
        endTime: '2024-10-15 16:40:00',
      },
      {
        name: '中卫102',
        code: 'w102',
        status: '待执行',
        startTime: '2024-10-15 16:00:00',
        endTime: '2024-10-15 16:40:00',
      },
      {
        name: '中卫102',
        code: 'w102',
        status: '待执行',
        startTime: '2024-10-15 16:00:00',
        endTime: '2024-10-15 16:40:00',
      },
      {
        name: '中卫102',
        code: 'w102',
        status: '待执行',
        startTime: '2024-10-15 16:00:00',
        endTime: '2024-10-15 16:40:00',
      },
      {
        name: '中卫102',
        code: 'w102',
        status: '待执行',
        startTime: '2024-10-15 16:00:00',
        endTime: '2024-10-15 16:40:00',
      },
      {
        name: '中卫102',
        code: 'w102',
        status: '待执行',
        startTime: '2024-10-15 16:00:00',
        endTime: '2024-10-15 16:40:00',
      },
      {
        name: '中卫102',
        code: 'w102',
        status: '待执行',
        startTime: '2024-10-15 16:00:00',
        endTime: '2024-10-15 16:40:00',
      },
      {
        name: '中卫102',
        code: 'w102',
        status: '待执行',
        startTime: '2024-10-15 16:00:00',
        endTime: '2024-10-15 16:40:00',
      },
      {
        name: '中卫102',
        code: 'w102',
        status: '待执行',
        startTime: '2024-10-15 16:00:00',
        endTime: '2024-10-15 16:40:00',
      },
      {
        name: '中卫102',
        code: 'w102',
        status: '待执行',
        startTime: '2024-10-15 16:00:00',
        endTime: '2024-10-15 16:40:00',
      },
      // 添加更多任务
    ];
  }

  sortByStartTime() {
    // 切换排序方向
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    const direction = this.sortDirection === 'asc' ? 1 : -1;

    // 对任务列表按设备开启时间进行排序
    this.tasks = [...this.tasks].sort((a, b) => {
      return (new Date(a.startTime) - new Date(b.startTime)) * direction;
    });
  }

  render() {
    return html`
      <div class="modal">
        <div class="header">
          任务状态
          <button class="close-button" @click="${this.closeModal}">×</button>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>任务名</th>
                <th>任务编号</th>
                <th>
                  设备开启时间
                  <div class="sort-container">
                    <span
                      @click="${this.sortByStartTime}"
                      style="display: flex; flex-direction: column; align-items: center; margin-left: 5px;"
                    >
                      <span
                        class="sort-arrow ${this.sortDirection === 'asc'
                          ? 'active'
                          : ''}"
                        >▲</span
                      >
                      <span
                        class="sort-arrow ${this.sortDirection === 'desc'
                          ? 'active'
                          : ''}"
                        >▼</span
                      >
                    </span>
                  </div>
                </th>
                <th>设备关闭时间</th>
                <th>任务状态</th>
              </tr>
            </thead>
            <tbody>
              ${this.tasks.map(
                (task) => html`
                  <tr>
                    <td>${task.name}</td>
                    <td>${task.code}</td>
                    <td>${task.startTime}</td>
                    <td>${task.endTime}</td>
                    <td>${task.status}</td>
                  </tr>
                `
              )}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
}

customElements.define('status-mission', StatusMission);
