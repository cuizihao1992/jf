import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/task-create-component.css?inline'; // 导入 CSS 文件
import { deviceService } from '@/api/fetch.js';

class TaskCreateComponent extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  constructor() {
    super();
    this.selectedDeviceList = [];
    this.deviceRows = [];
    this.fetchDeviceList();
  }

  async fetchDeviceList() {
    const res = await deviceService.list();
    this.deviceRows = res.rows;
    this.requestUpdate();
  }

  // 将右侧选中的设备添加到左侧
  addToSelectedDeviceList() {
    const selectedDevices = this.deviceRows.filter(
      (device) =>
        this.shadowRoot.querySelector(`#device-status-${device.id}`).checked
    );
    // 过滤掉已在 selectedDeviceList 中的设备，避免重复添加
    const newDevices = selectedDevices.filter(
      (device) => !this.selectedDeviceList.some((d) => d.id === device.id)
    );
    this.selectedDeviceList = [...this.selectedDeviceList, ...newDevices];
    // 从右侧列表中移除添加的设备
    this.deviceRows = this.deviceRows.filter(
      (device) => !newDevices.some((d) => d.id === device.id)
    );
    this.requestUpdate();
  }

  // 将左侧选中的设备从 selectedDeviceList 中移除
  removeFromSelectedDeviceList() {
    const devicesToRemove = this.selectedDeviceList.filter(
      (device) =>
        this.shadowRoot.querySelector(`#selected-device-${device.id}`).checked
    );
    // 将移除的设备重新添加到右侧设备列表中
    this.deviceRows = [...this.deviceRows, ...devicesToRemove];
    // 更新 selectedDeviceList 以移除选中的设备
    this.selectedDeviceList = this.selectedDeviceList.filter(
      (device) => !devicesToRemove.some((d) => d.id === device.id)
    );
    this.requestUpdate();
  }

  render() {
    const deviceStatusRows = this.deviceRows.map(
      (device) => html`
        <tr>
          <td>
            <input type="checkbox" id="device-status-${device.id}" />
            ${device.id}
          </td>
          <td>${device.region}</td>
          <td>${device.type}</td>
          <td><button class="power-status">⚡</button></td>
          <td>${device.status}</td>
          <td>${device.time}</td>
          <td>
            <button
              class="view-button colored-button"
              @click="${() => this.openStatusMission()}"
            >
              查看
            </button>
          </td>
        </tr>
      `
    );

    const deviceListTableRows = this.selectedDeviceList.map(
      (device) => html`
        <tr>
          <td>
            <input type="checkbox" id="selected-device-${device.id}" />
            ${device.id}
          </td>
          <td>方位角: ${device.horizontal}° 仰俯角: ${device.elevation}°</td>
          <td>
            水平角:
            <input type="text" placeholder="输入角度" style="width: 50px;" />
            俯仰角:
            <input type="text" placeholder="输入角度" style="width: 50px;" />
            <button class="nav-button">姿态计算</button>
          </td>
        </tr>
      `
    );

    return html`
      <div class="container">
        <div class="header">
          <h1>新建任务</h1>
          <span class="close-button" @click="${this.handleClose}">×</span>
        </div>
        <div class="flext">
          <div class="task-warp">
            <div class="task-info">
              <h2>任务信息</h2>
              <div class="row-task">
                <label for="task-name">任务名:</label>
                <input
                  type="text"
                  id="task-name"
                  placeholder="中卫101"
                  style="margin-left:19px;width:100px;padding:1px; height:22px;"
                />
                <label for="task-number" style="margin-left:69px"
                  >任务编号:</label
                >
                <input
                  type="text"
                  id="task-number"
                  placeholder="w101"
                  style="margin-left:5px;width:100px;height:24px;"
                />
              </div>
              <div class="row-location">
                <label for="location">所属地区:</label>
                <select
                  id="location"
                  style="margin-left:5px;width:106px;padding:1px; height:22px;"
                >
                  <option>中卫</option>
                </select>
                <label for="device-type" style="margin-left:68px"
                  >设备类型:</label
                >
                <select
                  id="device-type"
                  style="margin-left:5px;width:109px;padding:1px; height:25px;"
                >
                  <option>自动角反射器</option>
                </select>
              </div>
              <div class="form-group">
                <label for="start-time">设备开启时间/(年-月-日时-分-秒):</label>
                <input
                  type="text"
                  id="start-time"
                  placeholder="2024-09-24 16:21:45"
                />
              </div>
              <div class="form-group">
                <label for="end-time">设备关闭时间/(年-月-日时-分-秒):</label>
                <input
                  type="text"
                  id="end-time"
                  placeholder="2024-09-24 16:21:45"
                />
              </div>
              <div class="form-group">
                <label for="execution-time">任务执行时间/分钟(整数):</label>
                <input
                  type="text"
                  id="execution-time"
                  placeholder="40"
                  style="margin-left:67px"
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
                      <th>设备地理角度</th>
                      <th>设备调整角度</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${deviceListTableRows}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="plus-minus">
            <button @click="${this.addToSelectedDeviceList}">+</button>
            <button @click="${this.removeFromSelectedDeviceList}">-</button>
          </div>

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
                  ${deviceStatusRows}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="footer-buttons">
          <button
            class="config-button"
            @click="${() => this.openParameterConfig()}"
            style="background-color: #58a6ff;border-radius:4px; width: 90px; height: 30px; margin-right: 10px;font-size: 14px;margin-top: 50px;color: white;"
          >
            配置参数
          </button>
          <button
            class="select-button"
            @click="${() => this.openScopeSelection()}"
            style="background-color: #58a6ff;border-radius:4px;width: 90px; height: 30px;  font-size: 14px;margin-top: 50px;color: white;"
          >
            范围选择
          </button>
          <button
            class="submit-button"
            style="border-radius:4px;width: 60px; height: 30px;font-size: 14px;margin-top: 50px;"
          >
            提交
          </button>
        </div>
      </div>
    `;
  }

  handleClose() {
    // 这里可以添加关闭窗口的逻辑
    // 例如，隐藏组件或销毁组件
    this.remove();
  }
  openStatusMission() {
    this.dispatchEvent(new CustomEvent('open-status-mission'));
  }
  openParameterConfig() {
    this.dispatchEvent(new CustomEvent('open-parameter-config'));
  }
  openScopeSelection() {
    this.dispatchEvent(new CustomEvent('open-scope-selection'));
  }
}

customElements.define('task-create-component', TaskCreateComponent);
