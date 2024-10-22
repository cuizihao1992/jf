import { LitElement, html } from 'lit';
import '../components/custom-button.js'; // Import the reusable button component
import { sharedStyles } from '../components/shared-styles.js'; // 引入共享样式

class DeviceManagement extends LitElement {
  static styles = [sharedStyles];
  render() {
    return html`
      <custom-button label="新增设备" @button-click=${this.addDevice}></custom-button>
      <custom-button label="设备查询" @button-click=${this.queryDevice}></custom-button>
      <custom-button label="设备编辑" @button-click=${this.editDevice}></custom-button>
      <custom-button label="设备审批" @button-click=${this.approveDevice}></custom-button>
    `;
  }

  addDevice() {
    console.log('Add device clicked');
    // Logic for adding a new device
  }

  queryDevice() {
    console.log('Query device clicked');
    // Logic for querying devices
  }

  editDevice() {
    console.log('Edit device clicked');
    // Logic for editing a device
  }

  approveDevice() {
    console.log('Approve device clicked');
    // Logic for approving devices
  }
}

customElements.define('device-management', DeviceManagement);
