import { LitElement, html, css } from 'lit';
import '../../components/custom-button.js'; // Import the reusable button component
import { sharedStyles } from '../../components/shared-styles.js'; // 引入共享样式
import './components/device-add.js';
import './components/device-approve.js'; // 假设有创建任务组件
import './components/device-edit.js'; // 假设有任务查询组件
import './components/device-xiangqing.js'; // 假设有任务查询组件
import './components/device-review.js'; // 假设有任务查询组件
import './components/device-shenpi.js'; // 假设有任务查询组件
import './components/device-search.js'; // 假设有任务查询组件
import './components/device- particulars.js'; // 假设有任务查询组件

class DeviceManagement extends LitElement {
  static styles = [sharedStyles];

  static properties = {
    selectedButton: { type: String }, // 记录选中的按钮
    activeComponent: { type: String },
    isDevicexiangqingOpen: { type: Boolean },
    isDeviceReviewOpen: { type: Boolean },
    isDeviceShenpiOpen: { type: Boolean }, // 记录当前显示的组件
    isDeviceSearchOpen: { type: Boolean },
    isDeviceParticularsOpen: { type: Boolean },
  };

  constructor() {
    super();
    this.selectedButton = ''; // 初始状态没有选中按钮
    this.activeComponent = '';
    this.isTaskDetailsOpen = false;
    this.isDevicexiangqingOpen = false;
    this.isDeviceReviewOpen = false;
    this.isDeviceShenpiOpen = false;
    this.isDeviceSearchOpen = false;
    this.isDeviceParticularsOpen = false; // 初始状态不显示任何组件
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

      <div class="panel">${this.renderActiveComponent()}</div>

      <div class="panel-right">
        ${this.isDevicexiangqingOpen
          ? html`<device-xiangqing
              @close-modal=${this.closeDevicexiangqing}
            ></device-xiangqing>`
          : ''}
        ${this.isDeviceReviewOpen
          ? html`<device-review
              @close-modal=${this.closeDeviceReview}
            ></device-review>`
          : ''}
        ${this.isDeviceShenpiOpen
          ? html`<device-shenpi
              @close-modal=${this.closeDeviceShenpi}
            ></device-shenpi>`
          : ''}
        ${this.isDeviceParticularsOpen
          ? html`<device-particulars
              @close-modal=${this.closeDeviceParticulars}
            ></device-particulars>`
          : ''}
      </div>
    `;
  }

  setActiveComponent(componentName) {
    // 如果点击的按钮已经选中，取消选中并关闭组件
    if (this.activeComponent === componentName) {
      this.activeComponent = ''; // 关闭组件
      this.selectedButton = ''; // 清除选中状态
    } else {
      this.activeComponent = componentName; // 切换到新组件
      this.selectedButton = componentName;
      this.isDevicexiangqingOpen = false;
      this.isDeviceReviewOpen = false;
      this.isDeviceShenpiOpen = false;
      this.isDeviceParticularsOpen = false; // 设置当前选中的按钮
    }
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
          @open-device-xiangqing=${this.openDevicexiangqing}
          @open-device-particulars=${this.openDeviceParticulars}
        ></device-edit>`;
      case 'approveDevice':
        return html`<device-approve
          @close-modal=${this.closeTasks}
          @open-device-review=${this.openDevicereview}
          @open-device-shenpi=${this.openDeviceshenpi}
        ></device-approve>`;
      default:
        return ''; // 不显示任何组件
    }
  }
  closeTasks() {
    this.activeComponent = ''; // 隐藏当前组件
    this.selectedButton = ''; // 清除选中状态
  }
  openDevicexiangqing() {
    this.isDevicexiangqingOpen = true;
    this.isDeviceParticularsOpen = false;
  }
  closeDevicexiangqing() {
    this.isDevicexiangqingOpen = false;
  }
  openDeviceParticulars() {
    this.isDeviceParticularsOpen = true;
    this.isDevicexiangqingOpen = false;
    //this.isFaultDetailsOpen = false;
    //this.isTaskLogOpen = false// 打开故障详情弹窗
    // 打开任务详情弹窗
    //this.activeComponent = "taskDetails"; // 设置为任务详情组件
  }
  closeDeviceParticulars() {
    this.isDeviceParticularsOpen = false;
  }

  openDevicereview() {
    this.isDeviceReviewOpen = true;
    this.isDeviceShenpiOpen = false;
  }
  closeDeviceReview() {
    this.isDeviceReviewOpen = false;
  }
  openDeviceshenpi() {
    this.isDeviceShenpiOpen = true;
    this.isDeviceReviewOpen = false;
  }
  closeDeviceShenpi() {
    this.isDeviceShenpiOpen = false;
  }
}

customElements.define('device-management', DeviceManagement);
