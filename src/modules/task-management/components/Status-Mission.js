import { LitElement, html, css } from 'lit';

class StatusMission extends LitElement {
  static styles = css`
    .modal {
      position: fixed;
      top: 50%;
      left: 75%;
      transform: translate(-50%, -50%);
      padding: 20px;
      background: rgba(0, 9, 36, 0.8);
      color: white;
      border-radius: 10px;
      width: 700px;
      height: 500px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(42, 130, 228, 1);
      background-size: cover;
      background-position: center;
      z-index: 2;
    }

   .sort-container {
      display: flex;
      justify-content: right;
      align-items: center;
      margin-left: 145px;
      position: relative;
      margin-top: -24px;
    }
    .header {
      font-size: 20px;
      font-weight: bold;
      text-align: left;
      margin-bottom: 10px;
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

    table {
      width: 100%;
      border-collapse: collapse;
      color: white;
    }

    th, td {
      padding: 8px;
      text-align: center;
      border-bottom: 1px solid #444;
    }

    th {
      background-color: #1a2b4c;
      cursor: pointer;
    }
    
    tr:nth-child(even) {
      background-color: #0d1f33;
    }
    
    .sort-arrow {
      font-size: 14px;
      margin-left: 5px;
      color: #888; /* 默认灰色 */
    }
    
    .sort-arrow.active {
      color: #fff; /* 当前排序方向为白色 */
    }
    .table-container {
      max-height: 470px; /* 限制表格的最大高度 */
      overflow-y: auto; /* 仅表格内容滚动 */
    }      
  `;

  static properties = {
    tasks: { type: Array },
    sortDirection: { type: String }
  };

  constructor() {
    super();
    this.sortDirection = 'asc'; // 初始排序方向
    this.tasks = [
      { name: '中卫101', code: 'w101', status: '执行中', startTime: '2024-10-10 16:00:00', endTime: '2024-10-10 16:40:00' },
      { name: '中卫102', code: 'w102', status: '待执行', startTime: '2024-10-15 16:00:00', endTime: '2024-10-15 16:40:00' },
      { name: '中卫102', code: 'w102', status: '待执行', startTime: '2024-10-15 16:00:00', endTime: '2024-10-15 16:40:00' },
      { name: '中卫102', code: 'w102', status: '待执行', startTime: '2024-10-15 16:00:00', endTime: '2024-10-15 16:40:00' },
      { name: '中卫102', code: 'w102', status: '待执行', startTime: '2024-10-15 16:00:00', endTime: '2024-10-15 16:40:00' },
      { name: '中卫102', code: 'w102', status: '待执行', startTime: '2024-10-15 16:00:00', endTime: '2024-10-15 16:40:00' },
      { name: '中卫102', code: 'w102', status: '待执行', startTime: '2024-10-15 16:00:00', endTime: '2024-10-15 16:40:00' },
      { name: '中卫102', code: 'w102', status: '待执行', startTime: '2024-10-15 16:00:00', endTime: '2024-10-15 16:40:00' },
      { name: '中卫102', code: 'w102', status: '待执行', startTime: '2024-10-15 16:00:00', endTime: '2024-10-15 16:40:00' },
      { name: '中卫102', code: 'w102', status: '待执行', startTime: '2024-10-15 16:00:00', endTime: '2024-10-15 16:40:00' },
      { name: '中卫102', code: 'w102', status: '待执行', startTime: '2024-10-15 16:00:00', endTime: '2024-10-15 16:40:00' },
      { name: '中卫102', code: 'w102', status: '待执行', startTime: '2024-10-15 16:00:00', endTime: '2024-10-15 16:40:00' },
      { name: '中卫102', code: 'w102', status: '待执行', startTime: '2024-10-15 16:00:00', endTime: '2024-10-15 16:40:00' },
      { name: '中卫102', code: 'w102', status: '待执行', startTime: '2024-10-15 16:00:00', endTime: '2024-10-15 16:40:00' },
      { name: '中卫102', code: 'w102', status: '待执行', startTime: '2024-10-15 16:00:00', endTime: '2024-10-15 16:40:00' },
      { name: '中卫102', code: 'w102', status: '待执行', startTime: '2024-10-15 16:00:00', endTime: '2024-10-15 16:40:00' },
      { name: '中卫102', code: 'w102', status: '待执行', startTime: '2024-10-15 16:00:00', endTime: '2024-10-15 16:40:00' },
      { name: '中卫102', code: 'w102', status: '待执行', startTime: '2024-10-15 16:00:00', endTime: '2024-10-15 16:40:00' },
      { name: '中卫102', code: 'w102', status: '待执行', startTime: '2024-10-15 16:00:00', endTime: '2024-10-15 16:40:00' },
      { name: '中卫102', code: 'w102', status: '待执行', startTime: '2024-10-15 16:00:00', endTime: '2024-10-15 16:40:00' },
      { name: '中卫102', code: 'w102', status: '待执行', startTime: '2024-10-15 16:00:00', endTime: '2024-10-15 16:40:00' },
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
                <span @click="${this.sortByStartTime}" style="display: flex; flex-direction: column; align-items: center; margin-left: 5px;">
                  <span class="sort-arrow ${this.sortDirection === 'asc' ? 'active' : ''}">▲</span>
                  <span class="sort-arrow ${this.sortDirection === 'desc' ? 'active' : ''}">▼</span>
                </span>
                </div>
              </th>
              <th>设备关闭时间</th>
              <th>任务状态</th>
            </tr>
          </thead>
          <tbody>
            ${this.tasks.map(task => html`
              <tr>
                <td>${task.name}</td>
                <td>${task.code}</td>
                <td>${task.startTime}</td>
                <td>${task.endTime}</td>
                <td>${task.status}</td>
              </tr>
            `)}
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
