import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/task-review-review.css?inline';

class TaskReviewReview extends LitElement {
  static styles = css`${unsafeCSS(styles)}`;

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

    const deviceStatusRows = deviceRows.map((device) => html``);
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
          <h1>任务详情</h1>
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
                style="margin-left:3px;width:108px;height:23px;/* 圆角 */"
              />
            </div>
            <div class="row-location">
              <label for="location">审核状态:</label>
              <select
                id="location"
                style="margin-left:5px;width:106px;padding:1px; height:22px;"
              >
                <option>已提交</option>
              </select>
              <label for="device-type" style="margin-left:68px"
                >设备类型:</label
              >
              <select
                id="device-type"
                style="margin-left:5px;width:115px;padding:1px; height:25px;/* 圆角 */"
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
          <div class="review-info">
            <div class="row">
              <label for="reviewer">审核人:</label>
              <input type="text" id="reviewer" />
            </div>
            <div class="row">
              <label for="review-time">审核时间:</label>
              <input type="text" id="review-time" />
            </div>
            <div class="row">
              <label for="review-opinion">审核意见:</label>
              <input type="text" id="review-opinion" />
            </div>
            <div class="row">
              <label for="notes">备注:</label>
              <input
                type="text"
                id="review-opinion"
                style="width: 300px;height: 100px;"
              />
            </div>
            <button class="submit-button" @click="${this.handleClose}">
              确定
            </button>
          </div>
        </div>
      </div>
    `;
  }

  handleClose() {
    // 这里可以添加关闭窗口的逻辑
    // 例如，隐藏组件或销毁组件
    this.remove();
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
}

customElements.define('task-review-review', TaskReviewReview);
