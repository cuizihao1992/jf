import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/task-details.css?inline'; // 导入 CSS 文件
import { deviceTaskService, taskService } from '@/api/fetch.js';

class TaskDetails extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  constructor() {
    super();
    this.data = {}; // 默认值
    this.deviceListRows = []; // 用于存储设备信息
  }

  // 当组件首次连接到 DOM 时调用该方法，获取设备信息
  async connectedCallback() {
    super.connectedCallback();
    await this.fetchDeviceData();
  }

  async fetchDeviceData() {
    const deviceIds = this.data?.task?.deviceIds?.split(',') || [];
    const deviceData = await Promise.all(
      deviceIds.map(async (id) => {
        const res = await deviceTaskService.get(id);
        return { id, ...res.data }; // 合并设备ID和从接口获取的数据
      })
    );
    this.deviceListRows = deviceData; // 更新设备数据
    this.requestUpdate(); // 通知 LitElement 重新渲染
  }

  handleInputChange(event, field) {
    this.data.task[field] = event.target.value;
    this.requestUpdate();
  }

  saveTask() {
    console.log('Saving task data:', this.data);
    taskService.update(this.data.task);
    this.dispatchEvent(
      new CustomEvent('updateData', { bubbles: true, composed: true })
    );

    this.closeModal();
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
    const isEdit = this.data.isEdit;
    const isReview = this.data.isReview;

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
      <div class="container">
        <div class="header">
          <h1>任务详情</h1>
          <button class="close-button" @click="${this.closeModal}">×</button>
        </div>
        <div>
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
                style="margin-left:19px;width:100px;padding:1px; height:22px;"
              />
              <label for="task-number" style="margin-left:69px"
                >任务编号:</label
              >
              <input
                type="text"
                id="task-number"
                placeholder="请输入任务编号"
                .value="${this.data?.task?.taskNumber}"
                ?disabled="${!isEdit}"
                @input="${(e) => this.handleInputChange(e, 'taskNumber')}"
                style="margin-left:4px;width:108px;height:22px;"
              />
            </div>
            <div class="row-location">
              <label for="location">审核状态:</label>
              <select
                id="location"
                style="margin-left:5px;width:106px;padding:1px; height:22px;"
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
              <label for="device-type" style="margin-left:68px"
                >设备类型:</label
              >
              <select
                id="device-type"
                style="margin-left:5px;width:116px;padding:1px; height:25px;"
                ?disabled="${!isEdit}"
              >
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
                style="margin-left:66px"
              />
            </div>
          </div>
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
            <!-- 新增的保存和取消按钮 -->
            <div class="button-group">
              <button class="button cancel-button" @click="${this.cancelEdit}">
                取消
              </button>
              ${isEdit
                ? html`<button
                    class="button save-button"
                    @click="${this.saveTask}"
                  >
                    保存
                  </button>`
                : ''}
            </div>
          </div>
          ${isReview
            ? html`<div class="review-info">
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
                <button class="submit-button">确定</button>
              </div>`
            : ''}
        </div>
      </div>
    `;
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
}

customElements.define('task-details', TaskDetails);
