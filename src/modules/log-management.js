import { LitElement, html } from 'lit';
import '../components/custom-button.js'; // Import the reusable button component
import { sharedStyles } from '../components/shared-styles.js'; // 引入共享样式

class LogManagement extends LitElement {
  static styles = [sharedStyles];
  render() {
    return html`
      <custom-button label="任务日志" @button-click=${this.taskLog}></custom-button>
      <custom-button label="设备日志" @button-click=${this.deviceLog}></custom-button>
    `;
  }

  taskLog() {
    console.log('Task log clicked');
    // Logic for displaying task logs
  }

  deviceLog() {
    console.log('Device log clicked');
    // Logic for displaying device logs
  }
}

customElements.define('log-management', LogManagement);
