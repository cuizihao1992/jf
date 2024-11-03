import { LitElement, html, css, unsafeCSS } from 'lit';
import { taskService } from '@/api/fetch.js';
import styles from './css/task-info-component.css?inline'; // 导入 CSS 文件

class TaskInfoComponent extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `; // 使用外部 CSS 文件的样式

  static get properties() {
    return {
      tasks: { type: Array },
      showConfirmation: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.tasks = [];
    this.showConfirmation = false;
    this.fetchTasks();
  }

  async fetchTasks() {
    try {
      const data = await taskService.list({ pageNum: 1, pageSize: 10 });
      this.tasks = data.rows;
    } catch (error) {
      console.error('获取任务列表失败:', error);
    }
  }

  render() {
    return html`
      <div class="modal">
        <div class="header">
          任务信息<button class="close-button" @click="${this.closeModal}">
            ×
          </button>
        </div>
        <hr />
        <div class="form-container">
          <div class="form-group">
            <label for="search-type">任务查询类型:</label>
            <select id="search-type" style="background-color: gray;">
              <option>任务编号</option>
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
          <button class="query-button" @click="${this.fetchTasks}">查询</button>
        </div>
        <hr />
        <div class="form-container">
          <div class="form-group">
            <label for="device-type">设备类型:</label>
            <select id="device-type" style="background-color: gray;">
              <option>自动角反射器</option>
            </select>
          </div>
          <div class="form-group">
            <label for="location">所属地区:</label>
            <select id="location" style="background-color: gray;">
              <option>中卫</option>
            </select>
          </div>
          <div class="form-group">
            <label for="review-status">审批状态:</label>
            <select id="review-status" style="background-color: gray;">
              <option>已提交</option>
            </select>
          </div>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>序号</th>
                <th>任务名</th>
                <th>任务编号</th>
                <th>提交用户名</th>
                <th>设备类型</th>
                <th>所属地区</th>
                <th>审批状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              ${this.renderRows()}
            </tbody>
          </table>
        </div>
      </div>

      ${this.showConfirmation
        ? html`
            <div class="confirmation-modal">
              <div>提示:</div>
              <div>是否撤回此任务!!</div>
              <div class="confirmation-buttons">
                <button class="confirm-button" @click="${this.confirmRevoke}">
                  确定
                </button>
                <button class="cancel-button" @click="${this.cancelRevoke}">
                  取消
                </button>
              </div>
            </div>
          `
        : ''}
    `;
  }

  renderRows() {
    // 使用 tasks 数据渲染表格行
    return this.tasks.map(
      (task, index) => html`
        <tr class="table-row">
          <td>${index + 1}</td>
          <td>${task.taskName}</td>
          <td>${task.taskNumber}</td>
          <td>${task.submitName}</td>
          <td>${task.deviceType}</td>
          <td>${task.region}</td>
          <td>${task.approveStatus}</td>
          <td>
            <a @click="${() => this.openTaskDetails(task)}">查看</a> /
            <a @click="${() => this.openTaskEdit(task)}">编辑</a> /
            <a @click="${() => this.openRevokeConfirmation(task)}">撤回</a>
          </td>
        </tr>
      `
    );
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }

  openTaskDetails(task) {
    this.dispatchEvent(new CustomEvent('open-task-details', { detail: task }));
  }

  openTaskEdit(task) {
    this.dispatchEvent(new CustomEvent('open-task-edit', { detail: task }));
  }

  openRevokeConfirmation(task) {
    this.showConfirmation = true;
    this.currentTask = task; // 保存当前操作的任务
  }

  confirmRevoke() {
    this.showConfirmation = false;
    console.log('任务撤回确认:', this.currentTask);
    // 撤回逻辑可在此添加
  }

  cancelRevoke() {
    this.showConfirmation = false;
  }
}

customElements.define('task-info-component', TaskInfoComponent);
