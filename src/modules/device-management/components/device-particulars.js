import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/device-particulars.css?inline';
import { deviceService } from '@/api/fetch.js';

class DeviceParticulars extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  static get properties() {
    return {
      devices: { type: Array },
      selectedDevice: { type: Object },
      isEdit: { type: Boolean },
      isReview: { type: Boolean },
      isReviewEdit: { type: Boolean },
      data: { type: Object },
    };
  }

  constructor() {
    super();
    this.devices = [];
    this.selectedDevice = {};
    this.isEdit = false;
    this.isReview = false;
    this.isReviewEdit = false;
    this.data = {
      reviewer: '',
      reviewTime: '',
      reviewOpinion: '',
      notes: '',
    };
  }

  setDeviceData(detail) {
    if (detail) {
      this.selectedDevice = detail.device || {};
      if (detail.mode) {
        this.isEdit = detail.mode.isEdit;
        this.isReview = detail.mode.isReview;
        this.isReviewEdit = detail.mode.isReviewEdit;
      }
      if (detail.reviewData) {
        this.data = { ...detail.reviewData };
      }
      this.requestUpdate();
    }
  }

  handleInputChange(event, field) {
    this.selectedDevice[field] = event.target.value;
    this.requestUpdate();
  }

  handleReviewInputChange(event, field) {
    this.data[field] = event.target.value;
    this.requestUpdate();
  }

  saveDevice() {
    console.log('保存设备数据:', this.selectedDevice);
    deviceService.update(this.selectedDevice);
    this.dispatchEvent(
      new CustomEvent('updateData', { bubbles: true, composed: true })
    );
    this.closeModal();
  }

  submitReview() {
    console.log('提交审核数据:', {
      device: this.selectedDevice,
      review: this.data,
    });
    // 这里添加提交审核的逻辑
    this.closeModal();
  }

  render() {
    return html`
      <div class="modal">
        <div class="header">
          ${this.isReview ? '设备审批' : '设备详情'}
          <button class="close-button" @click="${this.closeModal}">×</button>
        </div>
        <div class="task-info">
          <h2>设备信息</h2>
          <div class="row-task">
            <label for="task-name">设备编号:</label>
            <input
              type="text"
              id="task-name"
              .value="${this.selectedDevice.id || ''}"
              ?readonly="${!this.isEdit}"
              @input="${(e) => this.handleInputChange(e, 'id')}"
            />
          </div>
          <div class="row-task-number">
            <label for="task-number">所属地区:</label>
            <input
              type="text"
              id="task-number"
              .value="${this.selectedDevice.region || ''}"
              ?readonly="${!this.isEdit}"
              @input="${(e) => this.handleInputChange(e, 'region')}"
            />
          </div>
          <div class="row-start-time">
            <label for="start-time">设备类型:</label>
            <input
              type="text"
              id="start-time"
              .value="${this.selectedDevice.deviceType || ''}"
              readonly
            />
          </div>
          <div class="row-location">
            <label for="location">偏磁角度:</label>
            <input
              id="location"
              .value="${this.selectedDevice.cpj || ''}"
              readonly
            />
          </div>
          <div class="row-end-time">
            <label for="end-time">安装方位角度:</label>
            <input
              type="text"
              id="end-time"
              .value="${this.selectedDevice.currentAzimuth || ''}"
              readonly
            />
          </div>
          <div class="row-execution-time">
            <label for="execution-time-1">安装俯仰角度:</label>
            <input
              type="text"
              id="execution-time-1"
              .value="${this.selectedDevice.currentElevation || ''}"
              readonly
            />
          </div>
          <div class="row-device-longitude">
            <label for="device-longitude">设备所在经度:</label>
            <input
              type="text"
              id="device-longitude"
              .value="${this.selectedDevice.lon || ''}"
              readonly
            />
          </div>
          <div class="row-device-latitude">
            <label for="device-latitude">设备所在纬度:</label>
            <input
              type="text"
              id="device-latitude"
              .value="${this.selectedDevice.lat || ''}"
              ?readonly="${!this.isEdit}"
              @input="${(e) => this.handleInputChange(e, 'lat')}"
            />
          </div>
        </div>

        ${this.isReview
          ? html`
              <div class="review-info">
                <div class="row">
                  <label for="reviewer">审核人:</label>
                  <input
                    type="text"
                    id="reviewer"
                    .value="${this.data.reviewer}"
                    ?readonly="${!this.isReviewEdit}"
                    @input="${(e) =>
                      this.handleReviewInputChange(e, 'reviewer')}"
                  />
                </div>
                <div class="row">
                  <label for="review-time">审核时间:</label>
                  <input
                    type="datetime-local"
                    id="review-time"
                    .value="${this.data.reviewTime}"
                    ?readonly="${!this.isReviewEdit}"
                    @input="${(e) =>
                      this.handleReviewInputChange(e, 'reviewTime')}"
                  />
                </div>
                <div class="row">
                  <label for="review-opinion">审核意见:</label>
                  <input
                    type="text"
                    id="review-opinion"
                    .value="${this.data.reviewOpinion}"
                    ?readonly="${!this.isReviewEdit}"
                    @input="${(e) =>
                      this.handleReviewInputChange(e, 'reviewOpinion')}"
                  />
                </div>
                <div class="row">
                  <label for="notes">备注:</label>
                  <textarea
                    id="notes"
                    .value="${this.data.notes}"
                    ?readonly="${!this.isReviewEdit}"
                    @input="${(e) => this.handleReviewInputChange(e, 'notes')}"
                  ></textarea>
                </div>
              </div>
            `
          : ''}

        <div class="button-group">
          <button class="cancel-button" @click="${this.closeModal}">
            取消
          </button>
          ${this.isEdit
            ? html`
                <button class="save-button" @click="${this.saveDevice}">
                  保存
                </button>
              `
            : ''}
          ${this.isReviewEdit
            ? html`
                <button class="submit-button" @click="${this.submitReview}">
                  提交审核
                </button>
              `
            : ''}
        </div>
      </div>
    `;
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
}

customElements.define('device-particulars', DeviceParticulars);
