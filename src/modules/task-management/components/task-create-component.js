import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/task-create-component.css?inline';

class TaskCreateComponent extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  render() {
    const deviceRows = [
      {
        id: 101,
        region: '中卫',
        type: '自动角反射器',
        status: '关机',
        time: '2024-9-24 16:21:45',
      },
      {
        id: 102,
        region: '中卫',
        type: '自动角反射器',
        status: '关机',
        time: '2024-9-24 16:21:45',
      },
      {
        id: 103,
        region: '中卫',
        type: '自动角反射器',
        status: '关机',
        time: '2024-9-24 16:21:45',
      },
      {
        id: 104,
        region: '中卫',
        type: '自动角反射器',
        status: '关机',
        time: '2024-9-24 16:21:45',
      },
      {
        id: 104,
        region: '中卫',
        type: '自动角反射器',
        status: '关机',
        time: '2024-9-24 16:21:45',
      },
      {
        id: 104,
        region: '中卫',
        type: '自动角反射器',
        status: '关机',
        time: '2024-9-24 16:21:45',
      },
      {
        id: 104,
        region: '中卫',
        type: '自动角反射器',
        status: '关机',
        time: '2024-9-24 16:21:45',
      },
      {
        id: 104,
        region: '中卫',
        type: '自动角反射器',
        status: '关机',
        time: '2024-9-24 16:21:45',
      },
      {
        id: 104,
        region: '中卫',
        type: '自动角反射器',
        status: '关机',
        time: '2024-9-24 16:21:45',
      },
      {
        id: 104,
        region: '中卫',
        type: '自动角反射器',
        status: '关机',
        time: '2024-9-24 16:21:45',
      },
      {
        id: 104,
        region: '中卫',
        type: '自动角反射器',
        status: '关机',
        time: '2024-9-24 16:21:45',
      },
    ];

    const deviceStatusRows = deviceRows.map(
      (device) => html`
        <tr>
          <td>
            <input type="checkbox" id="device-${device.id}" /> ${device.id}
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
    const deviceListRows = [
      { id: 201, angle: { horizontal: 0, elevation: 0 } },
      { id: 202, angle: { horizontal: 10, elevation: 5 } },
      { id: 203, angle: { horizontal: -5, elevation: 10 } },
      { id: 203, angle: { horizontal: -5, elevation: 10 } },
      { id: 203, angle: { horizontal: -5, elevation: 10 } },
      { id: 203, angle: { horizontal: -5, elevation: 10 } },
      { id: 203, angle: { horizontal: -5, elevation: 10 } },
      // 添加更多的设备行
    ];
    const deviceListTableRows = deviceListRows.map(
      (device) => html`
        <tr>
          <td>
            <input type="checkbox" id="device-${device.id}" />
            ${device.id}
          </td>
          <td>
            方位角: ${device.angle.horizontal}° 仰俯角:
            ${device.angle.elevation}°
          </td>
          <td>
            水平角:
            <input type="text" placeholder="输入角度" style="width: 50px;" />
            俯仰角:
            <input type="text" placeholder="输入角度" style="width: 50px;" />
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
        <div>
          <div class="task-info">
            <h2>任务信息</h2>
            <div class="row-task">
              <label for="task-name">任务名:</label>
              <input
                type="text"
                id="task-name"
                placeholder="中卫101"
                style="margin-left:19px;width:100px;padding:1px; height:22px;/* 圆角 */"
              />
              <label for="task-number" style="margin-left:69px"
                >任务编号:</label
              >
              <input
                type="text"
                id="task-number"
                placeholder="w101"
                style="margin-left:5px;width:100px;height:24px;/* 圆角 */"
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
                style="margin-left:5px;width:109px;padding:1px; height:25px;/* 圆角 */"
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
          <button>+</button>
          <button>-</button>
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
