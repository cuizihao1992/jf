import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/task-details.css?inline'; // 导入 CSS 文件
import api from '@/apis/api';

class TaskDetails extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  static get properties() {
    return {
      data: { type: Object },
      mode: { type: Object },
    };
  }

  constructor() {
    super();
    this.data = {};
    this.mode = {
      isEdit: false,
      isReview: false,
      isReviewEdit: false,
    };
    this.deviceListRows = [];
  }

  // 当组件首次连接到 DOM 时调用该方法，获取设备信息
  async connectedCallback() {
    super.connectedCallback();
  }

  handleInputChange(event, field) {
    this.data.task[field] = event.target.value;
    this.requestUpdate();
  }

  saveTask() {
    console.log('Saving task data:', this.data);
    api.tasksApi
      .update(this.data.task.taskId, this.data.task)
      .then((response) => {
        console.log('任务更新成功:', response);
        showToast({
          message: '任务更新成功！',
          type: 'success',
          duration: 3000,
        });
        this.dispatchEvent(
          new CustomEvent('updateData', { bubbles: true, composed: true })
        );

        this.closeModal();
      })
      .catch((error) => {
        console.error('任务更新失败:', error);
      });
  }

  cancelEdit() {
    console.log('Cancelling edit');
    this.closeModal();
  }
  formatDateTimeLocal0(dateTime) {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    return date.toISOString().slice(0, 16); // 截取到 'YYYY-MM-DDTHH:MM'
  }
  formatDateTimeLocal(dateTime) {
    if (!dateTime) return '';
    const date = new Date(dateTime);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  render() {
    const { isEdit, isReview, isReviewEdit } = this.mode;

    return html`
      <div class="container">
        <div class="header">
          <h1>${isReview ? '任务审核' : '任务详情'}</h1>
          <button class="close-button" @click="${this.closeModal}">×</button>
        </div>
        ${this.renderTaskInfo()} ${this.renderDeviceList()}
        ${isReview ? this.renderReviewInfo() : ''} ${this.renderActionButtons()}
      </div>
    `;
  }

  renderTaskInfo() {
    const { isEdit } = this.mode;
    return html`
      <div class="task-info">
        <h2>任务信息</h2>
        <div class="row-task">
          <label for="task-name">任务名:</label>
          <input
            type="text"
            id="task-name"
            placeholder="请输入任务名"
            .value="${this.data?.task?.taskName}"
            ?disabled="${!isEdit}"
            @input="${(e) => this.handleInputChange(e, 'taskName')}"
          />
          <label for="task-number">任务编号:</label>
          <input
            type="text"
            id="task-number"
            placeholder="请输入任务编号"
            .value="${this.data?.task?.taskNumber}"
            ?disabled="${!isEdit}"
            @input="${(e) => this.handleInputChange(e, 'taskNumber')}"
          />
        </div>
        <div class="row-location">
          <label for="location">审核状态:</label>
          <select
            id="location"
            .value="${this.data?.task?.reviewStatus}"
            ?disabled="${!isEdit}"
            @change="${(e) => this.handleInputChange(e, 'reviewStatus')}"
          >
            <option
              value="pending"
              ?selected="${this.data?.task?.reviewStatus === 'pending'}"
            >
              审核中
            </option>
            <option
              value="approved"
              ?selected="${this.data?.task?.reviewStatus === 'approved'}"
            >
              通过
            </option>
            <option
              value="rejected"
              ?selected="${this.data?.task?.reviewStatus === 'rejected'}"
            >
              驳回
            </option>
          </select>
          <label for="device-type">设备类型:</label>
          <select id="device-type" ?disabled="${!isEdit}">
            <option>自动角反射器</option>
          </select>
        </div>
        <div class="form-group">
          <label for="start-time">设备开启时间/(年-月-日时-分-秒):</label>
          <input
            type="datetime-local"
            id="start-time"
            placeholder="请输入设备开启时间"
            .value="${this.formatDateTimeLocal(this.data?.task?.startTime)}"
            ?disabled="${!isEdit}"
            @input="${(e) => this.handleInputChange(e, 'startTime')}"
          />
        </div>
        <div class="form-group">
          <label for="end-time">设备关闭时间/(年-月-日时-分-秒):</label>
          <input
            type="datetime-local"
            id="end-time"
            placeholder="请输入设备关闭时间"
            .value="${this.formatDateTimeLocal(this.data?.task?.endTime)}"
            ?disabled="${!isEdit}"
            @input="${(e) => this.handleInputChange(e, 'endTime')}"
          />
        </div>
        <div class="form-group">
          <label for="execution-time">任务执行时间/秒(整数):</label>
          <input
            type="text"
            id="execution-time"
            placeholder="请输入任务执行时间"
            .value="${this.data?.task?.duration}"
            ?disabled="${!isEdit}"
            @input="${(e) => this.handleInputChange(e, 'duration')}"
          />
        </div>
      </div>
    `;
  }

  renderDeviceList() {
    const { isEdit } = this.mode;

    const deviceListTableRows = this.deviceListRows.map(
      (device) => html`
        <tr>
          <td>
            <input
              type="checkbox"
              id="device-${device.deviceId}"
              ?disabled="${!isEdit}"
            />
            ${device.id}
          </td>
          <td>
            方位角: ${device.targetAzimuth}° 仰俯角: ${device.targetElevation}°
          </td>
          <td>
            水平角:
            <input
              type="text"
              placeholder="输入角度"
              style="width: 50px;"
              value="${device.adjustmentAzimuth}"
              ?disabled="${!isEdit}"
            />
            俯仰角:
            <input
              type="text"
              placeholder="输入角度"
              style="width: 50px;"
              value="${device.adjustmentElevation}"
              ?disabled="${!isEdit}"
            />
          </td>
        </tr>
      `
    );

    return html`
      <div class="device-list">
        <h3>执行设备列表</h3>
        <div class="tbody-wrapper">
          <table class="device-list-table">
            <thead>
              <tr>
                <th>设备编号</th>
                <th>设备目标角度</th>
                <th>设备调整角度</th>
              </tr>
            </thead>
            <tbody>
              ${deviceListTableRows}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  renderActionButtons() {
    const { isEdit, isReview, isReviewEdit } = this.mode;

    if (isReview) {
      return isReviewEdit
        ? html`
            <div class="button-group">
              <button class="submit-button" @click="${this.submitReview}">
                确定
              </button>
            </div>
          `
        : html`
            <div class="button-group">
              <button class="button cancel-button" @click="${this.cancelEdit}">
                取消
              </button>
            </div>
          `;
    }

    return html`
      <div class="button-group">
        ${isEdit
          ? html`
              <button class="button save-button" @click="${this.saveTask}">
                保存
              </button>
              <button class="button cancel-button" @click="${this.cancelEdit}">
                取消
              </button>
            `
          : html`
              <button class="button cancel-button" @click="${this.cancelEdit}">
                取消
              </button>
            `}
      </div>
    `;
  }

  renderReviewInfo() {
    return html`
      <div class="review-info">
        <div class="row">
          <label for="reviewer">审核人:</label>
          <input type="text" id="reviewer" />
        </div>
        <div class="row">
          <label for="review-time">审核时间:</label>
          <input type="text" id="review-time" />
        </div>
        <div class="row">
          <label for="review-opinion">审核意见:</label>
          <input type="text" id="review-opinion" />
        </div>
        <div class="row">
          <label for="notes">备注:</label>
          <textarea id="notes" placeholder=""></textarea>
        </div>
      </div>
    `;
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }

  setTaskData(detail) {
    if (detail) {
      this.data = { task: detail.task };
      this.mode = detail.mode || {
        isEdit: false,
        isReview: false,
        isReviewEdit: false,
      };
      this.requestUpdate();
    }
  }
}

customElements.define('task-details', TaskDetails);
