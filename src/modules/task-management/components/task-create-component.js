import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/task-create-component.css?inline';
import { deviceService } from '@/api/fetch.js';

class TaskCreateComponent extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  static get properties() {
    return {
      devices: { type: Array },
      selectedDevices: { type: Array },
    };
  }

  constructor() {
    super();
    this.devices = [];
    this.selectedDevices = [];
    this.fetchDevices();
  }

  async fetchDevices() {
    try {
      const params = {
        pageNum: 1,
        pageSize: 100000,
      };
      const data = await deviceService.list(params);
      this.devices = data.rows;
    } catch (error) {
      console.error('获取设备数据失败:', error);
    }
  }

  addSelectedDevices() {
    const checkboxes = this.shadowRoot.querySelectorAll(
      '.device-status-table input[type="checkbox"]:checked'
    );
    console.log('选中的复选框数量:', checkboxes.length);

    checkboxes.forEach((checkbox) => {
      const deviceId = checkbox.getAttribute('id').replace('device-', '');
      console.log('正在处理设备ID:', deviceId);

      const device = this.devices.find(
        (d) => String(d.id) === String(deviceId)
      );
      console.log('找到的设备:', device);

      if (
        device &&
        !this.selectedDevices.some((d) => String(d.id) === String(deviceId))
      ) {
        this.selectedDevices = [
          ...this.selectedDevices,
          {
            id: deviceId,
            angle: {
              horizontal: '0',
              elevation: '0',
            },
          },
        ];
        console.log('更新后的selectedDevices:', this.selectedDevices);
      }
      checkbox.checked = false;
    });

    this.requestUpdate();
  }

  removeSelectedDevices() {
    const checkboxes = this.shadowRoot.querySelectorAll(
      '.device-list-table input[type="checkbox"]:checked'
    );
    const deviceIdsToRemove = Array.from(checkboxes).map((checkbox) =>
      checkbox.id.replace('device-', '')
    );
    this.selectedDevices = this.selectedDevices.filter(
      (device) => !deviceIdsToRemove.includes(device.id)
    );
    checkboxes.forEach((checkbox) => (checkbox.checked = false));
  }

  render() {
    const deviceStatusRows = this.devices.map(
      (device) => html`
        <tr>
          <td>
            <input
              type="checkbox"
              id="device-${device.id}"
              .value="${device.id}"
            />
            ${device.id}
          </td>
          <td>${device.region}</td>
          <td>${device.deviceType}</td>
          <td><button class="power-status">${device.powerStatus}</button></td>
          <td>${device.deviceStatus}</td>
          <td>${device.lastSyncTime}</td>
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

    const deviceListTableRows = this.selectedDevices.map(
      (device) => html`
        <tr>
          <td>
            <input
              type="checkbox"
              id="device-${device.id}"
              .value="${device.id}"
            />
            ${device.id}
          </td>
          <td>方位角: ${device.horizontal}° 仰俯角: ${device.elevation}°</td>
          <td>
            水平角:
            <input
              type="text"
              placeholder="输入角度"
              style="width: 50px;"
              .value=${device.angle.horizontal}
              @input=${(e) =>
                this.updateAngle(device.id, 'horizontal', e.target.value)}
            />
            俯仰角:
            <input
              type="text"
              placeholder="输入角度"
              style="width: 50px;"
              .value=${device.angle.elevation}
              @input=${(e) =>
                this.updateAngle(device.id, 'elevation', e.target.value)}
            />
          </td>
        </tr>
      `
    );

    return html`
      <div class="container">
        <div class="header">
          <h1>新建任务</h1>
          <span class="close-button" @click="${this.closeModal}">×</span>
        </div>
        <div>
          <div class="task-info">
            <h2>任务信息</h2>
            <div class="row-task">
              <label for="task-name">任务名:</label>
              <input type="text" id="task-name" placeholder="请输入任务名" />
              <label for="task-number">任务编号:</label>
              <input
                type="text"
                id="task-number"
                placeholder="请输入任务编号"
              />
            </div>
            <div class="row-location">
              <label for="location">所属地区:</label>
              <select id="location">
                <option value="zhongwei">中卫</option>
              </select>
              <label for="device-type">设备类型:</label>
              <select id="device-type">
                <option value="reflector">自动角反射器</option>
              </select>
            </div>
            <div class="form-group">
              <label for="start-time">设备开启时间/(年-月-日时-分-秒):</label>
              <input
                type="datetime-local"
                id="start-time"
                placeholder="请输入设备开启时间"
              />
            </div>
            <div class="form-group">
              <label for="end-time">设备关闭时间/(年-月-日时-分-秒):</label>
              <input
                type="datetime-local"
                id="end-time"
                placeholder="请输入设备关闭时间"
              />
            </div>
            <div class="form-group">
              <label for="execution-time">任务执行时间/秒(整数):</label>
              <input
                type="text"
                id="execution-time"
                placeholder="请输入任务执行时间"
              />
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
        <div class="plus-minus">
          <button @click="${() => this.addSelectedDevices()}">+</button>
          <button @click="${() => this.removeSelectedDevices()}">-</button>
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
        <div class="footer-buttons">
          <button
            class="config-button"
            @click="${() => this.openParameterConfig()}"
          >
            配置参数
          </button>
          <button
            class="select-button"
            @click="${() => this.openScopeSelection()}"
          >
            范围选择
          </button>
          <button class="submit-button">提交</button>
        </div>
      </div>
    `;
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
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

  updateAngle(deviceId, angleType, value) {
    this.selectedDevices = this.selectedDevices.map((device) => {
      if (device.id === deviceId) {
        return {
          ...device,
          angle: {
            ...device.angle,
            [angleType]: value,
          },
        };
      }
      return device;
    });
  }
}

customElements.define('task-create-component', TaskCreateComponent);
