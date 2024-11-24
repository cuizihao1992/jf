import { LitElement, html } from 'lit';
import { taskCreateStyles } from './components/task-create-styles.js';
import { deviceServiceApi } from './components/deviceService.js';
import { renderDeviceRows } from './components/device-list.js';
import { renderSelectedDeviceRows } from './components/selected-device-list.js';

class TaskCreateComponent extends LitElement {
  static styles = taskCreateStyles;

  constructor() {
    super();
    this.selectedDeviceList = [];
    this.deviceRows = [];
    this.fetchDeviceList();
  }

  async fetchDeviceList() {
    const res = await deviceServiceApi.fetchDeviceList();
    this.deviceRows = res.rows;
    this.requestUpdate();
  }

  addToSelectedDeviceList() {
    const selectedDevices = this.deviceRows.filter(
      (device) =>
        this.shadowRoot.querySelector(`#device-status-${device.id}`).checked
    );
    const newDevices = selectedDevices.filter(
      (device) => !this.selectedDeviceList.some((d) => d.id === device.id)
    );
    this.selectedDeviceList = [...this.selectedDeviceList, ...newDevices];
    this.deviceRows = this.deviceRows.filter(
      (device) => !newDevices.some((d) => d.id === device.id)
    );
    this.requestUpdate();
  }

  removeFromSelectedDeviceList() {
    const devicesToRemove = this.selectedDeviceList.filter(
      (device) =>
        this.shadowRoot.querySelector(`#selected-device-${device.id}`).checked
    );
    this.deviceRows = [...this.deviceRows, ...devicesToRemove];
    this.selectedDeviceList = this.selectedDeviceList.filter(
      (device) => !devicesToRemove.some((d) => d.id === device.id)
    );
    this.requestUpdate();
  }

  render() {
    return html`
      <div class="container">
        <div class="header">
          <h1>新建任务</h1>
          <span class="close-button" @click="${this.handleClose}">×</span>
        </div>
        <div style="display:flex">
          <!-- 任务信息表单 -->
          <div>
            <div class="task-info">
              <h2>任务信息</h2>
              <div class="row-task">
                <label for="task-name">任务名:</label>
                <input
                  type="text"
                  id="task-name"
                  style="margin-left:19px;width:100px;padding:1px; height:22px;"
                />
                <label for="task-number" style="margin-left:69px"
                  >任务编号:</label
                >
                <input
                  type="text"
                  id="task-number"
                  style="margin-left:5px;width:100px;height:24px;"
                />
              </div>
            </div>

            <!-- 左侧已选择设备列表 -->
            <div class="device-list">
              <h3>执行设备列表</h3>
              <div class="tbody-wrapper">
                <table class="device-list-table">
                  <thead>
                    <tr>
                      <th>设备编号</th>
                      <th>设备地理角度</th>
                      <th>设备调整角度</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${renderSelectedDeviceRows(
                      this.selectedDeviceList,
                      this.removeFromSelectedDeviceList.bind(this)
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <!-- 操作按钮 -->
          <div class="plus-minus">
            <button @click="${this.addToSelectedDeviceList}">+</button>
            <button @click="${this.removeFromSelectedDeviceList}">-</button>
          </div>

          <!-- 右侧设备状态列表 -->
          <div class="device-status">
            <h3>设备状态列表</h3>
            <div class="tbody-new-wrapper">
              <table class="device-status-table">
                <thead>
                  <tr>
                    <th>设备编号</th>
                    <th>所属地区</th>
                    <th>设备类型</th>
                    <th>电源状态</th>
                    <th>设备状态</th>
                    <th>设备时间</th>
                    <th>任务状态</th>
                  </tr>
                </thead>
                <tbody>
                  ${renderDeviceRows(
                    this.deviceRows,
                    this.addToSelectedDeviceList.bind(this)
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  handleClose() {
    this.remove();
  }
}

customElements.define('task-create-component', TaskCreateComponent);
