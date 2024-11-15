import { LitElement, html, css } from 'lit';
import '../../components/custom-button.js';
import { sharedStyles } from '../../components/shared-styles.js';
import './components/device-add.js';
import './components/device-approve.js';
import './components/device-edit.js';
import './components/device-search.js';
import './components/device-particulars.js';

class DeviceManagement extends LitElement {
  static styles = [sharedStyles];

  static properties = {
    selectedButton: { type: String },
    activeComponent: { type: String },
    isDeviceParticularsOpen: { type: Boolean },
    deviceParticularsData: { type: Object },
  };

  constructor() {
    super();
    this.selectedButton = '';
    this.activeComponent = '';
    this.isDeviceParticularsOpen = false;
    this.deviceParticularsData = null;
  }

  render() {
    return html`
      <div class="left-buttons">
        <custom-button
          label="新增设备"
          ?selected=${this.selectedButton === 'addDevice'}
          @button-click=${() => this.setActiveComponent('addDevice')}
        ></custom-button>

        <custom-button
          label="设备查询"
          ?selected=${this.selectedButton === 'searchDevice'}
          @button-click=${() => this.setActiveComponent('searchDevice')}
        ></custom-button>

        <custom-button
          label="设备编辑"
          ?selected=${this.selectedButton === 'editDevice'}
          @button-click=${() => this.setActiveComponent('editDevice')}
        ></custom-button>

        <custom-button
          label="设备审批"
          ?selected=${this.selectedButton === 'approveDevice'}
          @button-click=${() => this.setActiveComponent('approveDevice')}
        ></custom-button>
      </div>

      <div class="panel">
        ${this.renderActiveComponent()}
        <div style="position:absolute;top:0;left:100%;">
          ${this.isDeviceParticularsOpen
            ? html`<device-particulars
                .deviceData=${this.deviceParticularsData}
                @close-modal=${this.closeDeviceParticulars}
              ></device-particulars>`
            : ''}
        </div>
      </div>
    `;
  }

  setActiveComponent(componentName) {
    if (this.selectedButton === componentName) {
      this.clearAllComponents();
    } else {
      this.clearAllComponents();
      this.activeComponent = componentName;
      this.selectedButton = componentName;
    }
  }

  clearAllComponents() {
    this.activeComponent = '';
    this.selectedButton = '';
    this.isDeviceParticularsOpen = false;
    this.deviceParticularsData = null;
  }

  renderActiveComponent() {
    switch (this.activeComponent) {
      case 'addDevice':
        return html`<device-add @close-modal=${this.closeTasks}></device-add>`;
      case 'searchDevice':
        return html`<device-search
          @close-modal=${this.closeTasks}
          @open-device-particulars=${this.openDeviceParticulars}
        ></device-search>`;
      case 'editDevice':
        return html`<device-edit
          @close-modal=${this.closeTasks}
          @open-device-particulars=${this.openDeviceParticulars}
        ></device-edit>`;
      case 'approveDevice':
        return html`<device-approve
          @close-modal=${this.closeTasks}
          @open-device-particulars=${this.openDeviceParticulars}
        ></device-approve>`;
      default:
        return '';
    }
  }

  closeTasks() {
    this.clearAllComponents();
  }

  openDeviceParticulars(e) {
    this.deviceParticularsData = e.detail;
    this.isDeviceParticularsOpen = true;

    requestAnimationFrame(() => {
      const particularsElement =
        this.shadowRoot.querySelector('device-particulars');
      if (particularsElement) {
        particularsElement.setDeviceData(e.detail);
        particularsElement.addEventListener('updateData', () => {
          this.handleDeviceUpdate();
        });
      }
    });
  }

  closeDeviceParticulars() {
    this.isDeviceParticularsOpen = false;
    this.deviceParticularsData = null;
  }

  handleDeviceUpdate() {
    const activeComponent = this.shadowRoot.querySelector(
      'device-edit, device-search, device-approve'
    );
    if (activeComponent) {
      activeComponent.fetchDevices();
    }
  }
}

customElements.define('device-management', DeviceManagement);
