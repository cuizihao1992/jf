import { LitElement, html, css } from 'lit';

class Devicexiangqing1 extends LitElement {
  static styles = css`
    .modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 20px;
      background: rgba(0, 9, 36, 0.8);
      color: white;
      border-radius: 10px;
      width: 600px;
      height: 530px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      opacity: 1;
      border: 1px solid rgba(42, 130, 228, 1);
    }

    .header {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
      text-align: left;
    }

    .form-container {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: 20px;
    }

    .form-group {
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 10px;
    }

    .form-group label {
      margin-right: 10px;
      white-space: nowrap;
    }

    .form-group select,
    .form-group input {
      padding: 5px;
      background-color: #1b2a41;
      color: white;
      border: none;
      border-radius: 5px;
      flex-grow: 1;
    }

    .button-group {
      display: flex;
      justify-content: space-around;
      width: 100%;
    }

    .action-button {
      padding: 10px 20px;
      background-color: #58a6ff;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      width: 150px;
      text-align: center;
    }
     .task-info {
      grid-column: 1; /* 占第一列 */
      display: grid;
      gap: 5px; /* 间距 */
      border: 1px solid #58a6ff;
      padding: 10px; /* 内边距 */
      border-radius: 5px;
      background-color: rgba(20, 30, 50, 0.8); /* 背景颜色 */
      width: 580px;
      height: 420px; /* 高度缩小至原来的三分之二 */
    }
    .task-info h2 {
      margin: 0;
      padding-bottom: 1px; /* 内边距 */
      text-align: left;
      font-size: 25px; /* 字体大小 */

    }
    .task-info .row {
      display: flex;
      justify-content: space-between; /* 标签和输入框分布均匀 */
      align-items: center; /* 垂直居中 */
      gap: 0px; /* 间距 */
    }
    .task-info label {
      color: white;
      width: 100px; /* 标签宽度 */
      font-size: 14px; /* 字体大小 */
    }
      .close-button {
      cursor: pointer;
      color: white;
      background: none;
      border: none;
      font-size: 25px;
      font-weight: bold;
      float: right;
    }

  `;

  render() {
    return html`
      <div class="modal">
        <div class="header">设备详情
        <button class="close-button" @click="${this.closeModal}">×</button>
        </div>
        
        <hr/>
        <div class="task-info">
          <h2>设备信息</h2>
        <div class="row-task">
    <label for="task-name" style="display:inline-block;width:100px;">设备编号:</label>
    <input type="text" id="task-name"  style="width:180px;height:25px;border-radius: 4px; /* 圆角 */"/>
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

<div class="row-location">
    <label for="location" style="display:inline-block;width:100px;">偏磁角度:</label>
    <input id="location" style="width:180px;height:25px;border-radius: 4px;">
    </input>
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
        </div>

      </div>
    `;
  }
  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }

   handleClose() {
    // 这里可以添加关闭窗口的逻辑
    // 例如，隐藏组件或销毁组件
    this.remove();
    this.dispatchEvent(new CustomEvent('close-modal'));

  }
}

customElements.define('device-xiangqing1', Devicexiangqing1);