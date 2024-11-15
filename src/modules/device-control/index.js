import { LitElement, html, css } from 'lit';
import '../../components/custom-button.js';
import { sharedStyles } from '../../components/shared-styles.js';
import './components/device-query.js';
import './components/posture-adjust.js';
import './components/realtime-imagery.js';
import './components/angle-detection.js';
import './components/single-device-log.js';
import './components/device-list.js';
import '@/modules/task-management/components/parameter-config.js';

class DeviceControl extends LitElement {
  static styles = [
    sharedStyles,
    css`
      .modal-container {
        display: flex;
        position: absolute;
      }
      .posture-adjust-modal {
        margin-left: 945px; /* 姿态调整弹窗与设备查询弹窗的距离 */
      }
    `,
  ];

  static properties = {
    selectedButton: { type: String },
    isModalOpen: { type: Boolean },
    isPostureAdjustModalOpen: { type: Boolean },
    isRealtimeImageryOpen: { type: Boolean },
    isAngleDetectionOpen: { type: Boolean },
    isSingleDeviceLogOpen: { type: Boolean },
    isParameterConfigOpen: { type: Boolean },
  };

  constructor() {
    super();
    this.selectedButton = '';
    this.isModalOpen = false;
    this.isPostureAdjustModalOpen = false;
    this.isRealtimeImageryOpen = false;
    this.isAngleDetectionOpen = false;
    this.isSingleDeviceLogOpen = false;
    this.isParameterConfigOpen = false;
  }

  render() {
    return html`
      <div class="left-buttons">
        <custom-button
          label="设备查询"
          ?selected=${this.selectedButton === 'query'}
          @button-click=${() => this.toggleModal('query')}
        ></custom-button>
        <custom-button
          label="设备列表"
          ?selected=${this.selectedButton === 'list'}
          @button-click=${() => this.setActiveComponent('list')}
        ></custom-button>
      </div>

      <div class="panel">
        ${this.selectedButton === 'list'
          ? html`<device-list></device-list>`
          : ''}

        <div class="modal-container">
          ${this.isModalOpen && this.selectedButton === 'query'
            ? html`
                <device-query
                  ?showactions=${true}
                  @close-modal=${this.closeModal}
                  @open-posture-adjust=${this.openPostureAdjustModal}
                ></device-query>
              `
            : ''}
          ${this.isPostureAdjustModalOpen
            ? html`
                <posture-adjust
                  class="posture-adjust-modal"
                  @close-modal=${this.closePostureAdjustModal}
                  @open-realtime-imagery=${this.openRealtimeImagery}
                  @open-angle-detection=${this.openAngleDetection}
                  @open-single-device-log=${this.openSingleDeviceLog}
                  @open-parameter-config=${this.openParameterConfig}
                ></posture-adjust>
              `
            : ''}
          ${this.isRealtimeImageryOpen
            ? html`<realtime-imagery
                @close-modal=${this.closeRealtimeImagery}
              ></realtime-imagery>`
            : ''}
          ${this.isAngleDetectionOpen
            ? html`<angle-detection
                @close-modal=${this.closeAngleDetection}
              ></angle-detection>`
            : ''}
          ${this.isSingleDeviceLogOpen
            ? html`<single-device-log
                @close-modal=${this.closeSingleDeviceLog}
              ></single-device-log>`
            : ''}
          <!-- 参数配置弹窗 -->
          ${this.isParameterConfigOpen
            ? html`<parameter-config
                @close-modal=${this.closeParameterConfig}
                @angles-calculated=${this.handleAnglesCalculated}
              ></parameter-config>`
            : ''}
        </div>
      </div>
    `;
  }

  toggleModal(buttonName) {
    if (this.selectedButton === buttonName) {
      this.isModalOpen = !this.isModalOpen;
    } else {
      this.selectedButton = buttonName;
      this.isModalOpen = buttonName === 'query';
    }
  }

  selectButton(buttonName) {
    if (buttonName === 'list') {
      this.isModalOpen = false;
      this.selectedButton = this.selectedButton === 'list' ? '' : 'list';
    } else {
      this.selectedButton = buttonName;
      this.isModalOpen = false;
      this.isPostureAdjustModalOpen = false;
    }
  }

  setActiveComponent(componentName) {
    if (this.activeComponent === componentName) {
      this.activeComponent = '';
      this.selectedButton = '';
    } else {
      this.activeComponent = componentName;
      this.selectedButton = componentName;
      this.isPostureAdjustModalOpen = false;
    }
  }

  openPostureAdjustModal() {
    this.isPostureAdjustModalOpen = true;
  }

  openRealtimeImagery() {
    this.isRealtimeImageryOpen = true;
  }

  openAngleDetection() {
    this.isAngleDetectionOpen = true;
  }

  openSingleDeviceLog() {
    this.isSingleDeviceLogOpen = true;
  }

  openParameterConfig() {
    this.isParameterConfigOpen = true;
  }

  closeParameterConfig() {
    this.isParameterConfigOpen = false;
  }

  closeAngleDetection() {
    this.isAngleDetectionOpen = false;
  }

  closeSingleDeviceLog() {
    this.isSingleDeviceLogOpen = false;
  }

  closePostureAdjustModal() {
    this.isPostureAdjustModalOpen = false;
  }

  closeRealtimeImagery() {
    this.isRealtimeImageryOpen = false;
  }

  closeModal() {
    this.isModalOpen = false;
  }
  // 添加处理计算角度的方法
  handleAnglesCalculated(event) {
    const { azimuth, elevation } = event.detail;
    const postureAdjust = this.shadowRoot.querySelector('posture-adjust');
    if (postureAdjust) {
      postureAdjust.updateAngles(azimuth, elevation);
    }
  }
}

customElements.define('device-control', DeviceControl);
