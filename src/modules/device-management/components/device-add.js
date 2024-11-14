import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/device-add.css?inline';

class DeviceAdd extends LitElement {
  static styles = css`${unsafeCSS(styles)}`;

  render() {
    return html`
      <div class="modal">
        <div class="header">新增设备
        <button class="close-button" @click="${this.closeModal}">×</button>
        </div>
        <div class="task-info">
          <h2>设备信息</h2>
        <div class="row-task">
    <label for="task-name" style="display:inline-block;width:100px;">提交用户名:</label>
    <input type="text" id="task-name"  style="width:180px;height:25px;border-radius: 4px; /* 圆角 */"/>
</div>

<div class="row-task-number">
    <label for="task-number" style="display:inline-block;width:100px;">任务编号:</label>
    <input type="text" id="task-number"  style="width:180px;height:25px;border-radius: 4px; /* 圆角 */"/>
</div>

<div class="row-location">
    <label for="location" style="display:inline-block;width:100px;">偏磁角度:</label>
    <input id="location" style="width:180px;height:25px;border-radius: 4px;">
    </input>
</div>

<div class="row-device-type">
    <label for="device-type" style="display:inline-block;width:100px;">所属地区:</label>
    <select id="device-type"style="width:140px; height:35px;border-radius: 4px;">
        <option>中卫</option>
    </select>
</div>

<div class="row-start-time">
    <label for="start-time" style="display:inline-block;width:100px;">设备类型:</label>
    <select type="text" id="start-time"  style="width:140px;height:35px;border-radius: 4px; /* 圆角 */"/>
        <option>自动角反射器</option>
        </select>
</div>

<div class="row-end-time">
    <label for="end-time" style="display:inline-block;width:100px;">安装方位角度:</label>
    <input type="text" id="end-time"  style="width:180px;height:25px;border-radius: 4px; /* 圆角 */"/>
</div>

<div class="row-execution-time">
    <label for="execution-time-1" style="display:inline-block;width:100px;">安装俯仰角度:</label>
    <input type="number" id="execution-time-1"  style="width:180px;height:25px;border-radius: 4px; /* 圆角 */"/>
</div>

<div class="row-device-longitude">
    <label for="device-longitude" style="display:inline-block;width:100px;">设备所在经度:</label>
    <input type="number" id="device-longitude"  style="width:180px;height:25px;border-radius: 4px; /* 圆角 */"/>
</div>

<div class="row-device-latitude">
    <label for="device-latitude" style="display:inline-block;width:100px;">设备所在纬度:</label>
    <input type="number" id="device-latitude"  style="width:180px;height:25px;border-radius: 4px; /* 圆角 */"/>
</div>

<div class="row-installation-year">
    <label for="installation-year" style="display:inline-block;width:100px;">安装年份:</label>
    <input type="number" id="installation-year"  style="width:180px;height:25px;border-radius: 4px; /* 圆角 */"/>
</div>

        </div>
        <div class="button-group" style="margin-top: 15px;">
    <button class="action-button" @click="${this.submit}">提交</button>
    <button class="action-button" @click="${this.cancel}">取消</button>
</div>

      </div>
    `;
  }
  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }

  submit() {
    // 这里可以添加关闭窗口的逻辑
    // 例如，隐藏组件或销毁组件
    this.remove();
    this.dispatchEvent(new CustomEvent('close-modal'));
  }

  cancel() {
    // 这里可以添加关闭窗口的逻辑
    // 例如，隐藏组件或销毁组件
    this.remove();
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
}

customElements.define('device-add', DeviceAdd);
