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
    this.selectedDevice = {
      ...this.selectedDevice,
      [field]: event.target.value,
    };
    this.requestUpdate();
  }

  handleReviewInputChange(event, field) {
    this.data[field] = event.target.value;
    this.requestUpdate();
  }

  async saveDevice() {
    try {
      console.log('保存设备数据:', this.selectedDevice);
      await deviceService.update(this.selectedDevice);
      this.dispatchEvent(
        new CustomEvent('updateData', {
          detail: this.selectedDevice,
          bubbles: true,
          composed: true,
        })
      );
      this.closeModal();
    } catch (error) {
      console.error('保存设备数据失败:', error);
    }
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
      <div class="container">
        <div class="header">
          <h1>${this.isReview ? '设备审批' : '设备详情'}</h1>
          <button class="close-button" @click="${this.closeModal}">×</button>
        </div>

        ${this.renderDeviceInfo()}
        ${this.isReview ? this.renderReviewInfo() : ''} ${this.renderButtons()}
      </div>
    `;
  }

  renderDeviceInfo() {
    return html`
      <div class="task-info">
        <h2>设备信息</h2>
        <hr style="width: 325px; height:0px; border:none; border-top:1px solid #58a6ff; margin: -11px 0 10px 0;" />
        <div class="row">
          <label for="device-name">设备名:</label>
          <input
            type="text"
            id="device-name"
            .value="${this.selectedDevice.deviceName || ''}"
            ?disabled="${!this.isEdit}"
            @input="${(e) => this.handleInputChange(e, 'deviceName')}"
          />
        </div>
        <div class="row">
          <label for="device-region">所属地区:</label>
          <input
            type="text"
            id="device-region"
            .value="${this.selectedDevice.region || ''}"
            ?disabled="${!this.isEdit}"
            @input="${(e) => this.handleInputChange(e, 'region')}"
          />
        </div>
        <div class="row-start-time">
          <label for="device-type">设备类型:</label>
          <input
            type="text"
            id="device-type"
            .value="${this.selectedDevice.deviceType || ''}"
            ?disabled="${!this.isEdit}"
            @input="${(e) => this.handleInputChange(e, 'deviceType')}"
          />
        </div>
        
        <h2>安装信息</h2>
        <hr style="width: 325px; height:0px; border:none; border-top:1px solid #58a6ff; margin: -11px 0 10px 0;" />
        <div class="row-location">
          <label for="cpj">偏磁角度:</label>
          <input
            id="cpj"
            .value="${this.selectedDevice.cpj || ''}"
            ?disabled="${!this.isEdit}"
            @input="${(e) => this.handleInputChange(e, 'cpj')}"
          />
        </div>
        <div class="row-end-time">
          <label for="currentAzimuth">安装方位角度:</label>
          <input
            type="text"
            id="currentAzimuth"
            .value="${this.selectedDevice.currentAzimuth || ''}"
            ?disabled="${!this.isEdit}"
            @input="${(e) => this.handleInputChange(e, 'currentAzimuth')}"
          />
        </div>
        <div class="row-execution-time">
          <label for="currentElevation">安装俯仰角度:</label>
          <input
            type="text"
            id="currentElevation"
            .value="${this.selectedDevice.currentElevation || ''}"
            ?disabled="${!this.isEdit}"
            @input="${(e) => this.handleInputChange(e, 'currentElevation')}"
          />
        </div>
        <div class="row-device-longitude">
          <label for="device-longitude">设备所在经度:</label>
          <input
            type="text"
            id="device-longitude"
            .value="${this.selectedDevice.lon || ''}"
            ?disabled="${!this.isEdit}"
            @input="${(e) => this.handleInputChange(e, 'lon')}"
          />
        </div>
        <div class="row-device-latitude">
          <label for="device-latitude">设备所在纬度:</label>
          <input
            type="text"
            id="device-latitude"
            .value="${this.selectedDevice.lat || ''}"
            ?disabled="${!this.isEdit}"
            @input="${(e) => this.handleInputChange(e, 'lat')}"
          />
        </div>
      </div>
    `;
  }

  renderReviewInfo() {
    return html`
      <div class="review-info">
        <div class="row">
          <label for="reviewer">审核人:</label>
          <input
            type="text"
            id="reviewer"
            .value="${this.data.reviewer}"
            ?disabled="${!this.isReviewEdit}"
            @input="${(e) => this.handleReviewInputChange(e, 'reviewer')}"
          />
        </div>
        <div class="row">
          <label for="review-time">审核时间:</label>
          <input
            type="datetime-local"
            id="review-time"
            .value="${this.data.reviewTime}"
            ?disabled="${!this.isReviewEdit}"
            @input="${(e) => this.handleReviewInputChange(e, 'reviewTime')}"
          />
        </div>
        <div class="row">
          <label for="review-opinion">审核意见:</label>
          <input
            type="text"
            id="review-opinion"
            .value="${this.data.reviewOpinion}"
            ?disabled="${!this.isReviewEdit}"
            @input="${(e) => this.handleReviewInputChange(e, 'reviewOpinion')}"
          />
        </div>
        <div class="row">
          <label for="notes">备注:</label>
          <textarea
            id="notes"
            .value="${this.data.notes}"
            ?disabled="${!this.isReviewEdit}"
            @input="${(e) => this.handleReviewInputChange(e, 'notes')}"
          ></textarea>
        </div>
      </div>
    `;
  }

  renderButtons() {
    return html`
      <div class="button-group">
        <button class="cancel-button" @click="${this.closeModal}">取消</button>
        ${this.isEdit
          ? html`<button class="save-button" @click="${this.saveDevice}">
              保存
            </button>`
          : ''}
        ${this.isReviewEdit
          ? html`<button class="submit-button" @click="${this.submitReview}">
              提交
            </button>`
          : ''}
      </div>
    `;
  }
  

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
}

customElements.define('device-particulars', DeviceParticulars);
