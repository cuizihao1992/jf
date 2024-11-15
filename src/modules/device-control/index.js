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
        position: absolute;
        transition: all 0.3s ease-in-out;
      }
      .posture-adjust-modal.with-query {
        margin-left: 945px;
      }
      .posture-adjust-modal.without-query {
        left: 20px;
        top: 20px;
      }
      .realtime-imagery-modal {
        position: absolute;
      }
      .angle-detection-modal {
        position: absolute;
      }
      .single-device-log-modal {
        position: absolute;
        left: 460px;
        top: 20px;
      }
      .parameter-config-modal {
        position: absolute;
        left: 462px;
        top: 279px;
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
    this.activeComponent = '';
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
                  class="posture-adjust-modal ${this.isModalOpen
                    ? 'with-query'
                    : 'without-query'}"
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
                class="realtime-imagery-modal"
                @close-modal=${this.closeRealtimeImagery}
              ></realtime-imagery>`
            : ''}
          ${this.isAngleDetectionOpen
            ? html`<angle-detection
                class="angle-detection-modal"
                @close-modal=${this.closeAngleDetection}
              ></angle-detection>`
            : ''}
          ${this.isSingleDeviceLogOpen
            ? html`<single-device-log
                class="single-device-log-modal"
                @close-modal=${this.closeSingleDeviceLog}
              ></single-device-log>`
            : ''}
          ${this.isParameterConfigOpen
            ? html`<parameter-config
                class="parameter-config-modal"
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
      this.clearAllComponents();
    } else {
      this.clearAllComponents();
      this.selectedButton = buttonName;
      this.isModalOpen = buttonName === 'query';
    }
  }

  clearAllComponents() {
    this.isModalOpen = false;
    this.isPostureAdjustModalOpen = false;
    this.isRealtimeImageryOpen = false;
    this.isAngleDetectionOpen = false;
    this.isSingleDeviceLogOpen = false;
    this.isParameterConfigOpen = false;
    this.selectedButton = '';
  }

  setActiveComponent(componentName) {
    if (this.selectedButton === componentName) {
      this.selectedButton = ''; // Deselect if already active
    } else {
      this.selectedButton = componentName;
      this.isModalOpen = false; // Ensure no modal is opened when switching to the list
      this.isPostureAdjustModalOpen = false;
      this.isRealtimeImageryOpen = false;
      this.isAngleDetectionOpen = false;
      this.isSingleDeviceLogOpen = false;
      this.isParameterConfigOpen = false;
    }
  }

  openPostureAdjustModal() {
    this.isPostureAdjustModalOpen = true;
  }

  openRealtimeImagery() {
    this.isRealtimeImageryOpen = true;
    this.isAngleDetectionOpen = false;
    this.isSingleDeviceLogOpen = false;
    this.isParameterConfigOpen = false;
    this.isModalOpen = false;
    this.selectedButton = '';
  }

  openAngleDetection() {
    this.isAngleDetectionOpen = true;
    this.isRealtimeImageryOpen = false;
    this.isSingleDeviceLogOpen = false;
    this.isParameterConfigOpen = false;
    this.isModalOpen = false;
    this.selectedButton = '';
  }

  openSingleDeviceLog() {
    this.isSingleDeviceLogOpen = true;
    this.isRealtimeImageryOpen = false;
    this.isAngleDetectionOpen = false;
    this.isParameterConfigOpen = false;
    this.isModalOpen = false;
    this.selectedButton = '';
  }

  openParameterConfig() {
    this.isParameterConfigOpen = true;
    this.isRealtimeImageryOpen = false;
    this.isAngleDetectionOpen = false;
    this.isSingleDeviceLogOpen = false;
    this.isModalOpen = false;
    this.selectedButton = '';
  }

  closeModal() {
    this.isModalOpen = false;
    this.isPostureAdjustModalOpen = false;
  }

  closeParameterConfig() {
    this.isParameterConfigOpen = false;
    this.selectedButton = 'query';
    this.isModalOpen = true;
  }

  closeAngleDetection() {
    this.isAngleDetectionOpen = false;
    this.selectedButton = 'query';
    this.isModalOpen = true;
  }

  closeSingleDeviceLog() {
    this.isSingleDeviceLogOpen = false;
    this.selectedButton = 'query';
    this.isModalOpen = true;
  }

  closePostureAdjustModal() {
    this.isPostureAdjustModalOpen = false;
    this.selectedButton = 'query';
    this.isModalOpen = true;
    this.isRealtimeImageryOpen = false;
    this.isAngleDetectionOpen = false;
    this.isSingleDeviceLogOpen = false;
    this.isParameterConfigOpen = false;
  }

  closeRealtimeImagery() {
    this.isRealtimeImageryOpen = false;
    this.selectedButton = 'query';
    this.isModalOpen = true;
  }

  handleAnglesCalculated(event) {
    const { azimuth, elevation } = event.detail;
    const postureAdjust = this.shadowRoot.querySelector('posture-adjust');
    if (postureAdjust) {
      postureAdjust.updateAngles(azimuth, elevation);
    }
  }
}

customElements.define('device-control', DeviceControl);
