import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/status-mission.css?inline';
import api from '@/apis/api';

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
    this.sortDirection = 'asc';
    this.tasks = [];
    this.fetchTasks(); // 初始化时获取任务数据
  }

  async fetchTasks() {
    try {
      const params = {};
      const response = await api.tasksApi.query(params);
      if (response) {
        this.tasks = response.map((task) => ({
          name: task.taskName,
          code: task.taskNumber,
          status: task.taskStatus,
          startTime: task.startTime,
          endTime: task.endTime,
        }));
      }
    } catch (error) {
      console.error('获取任务列表失败:', error);
    }
  }

  sortByStartTime() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    const direction = this.sortDirection === 'asc' ? 1 : -1;

    this.tasks = [...this.tasks].sort((a, b) => {
      return (new Date(a.startTime) - new Date(b.startTime)) * direction;
    });
    this.requestUpdate();
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
                <th>设备开启时间</th>
                <th>设备关闭时间</th>
                <th>任务状态</th>
              </tr>
            </thead>
            <tbody>
              ${this.tasks.length
                ? this.tasks.map(
                    (task) => html`
                      <tr>
                        <td>${task.name}</td>
                        <td>${task.code}</td>
                        <td>${task.startTime}</td>
                        <td>${task.endTime}</td>
                        <td>${task.status}</td>
                      </tr>
                    `
                  )
                : html`<tr>
                    <td colspan="5" style="text-align: center;">暂无数据</td>
                  </tr>`}
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
