import { LitElement, html, css } from 'lit';
class Deviceparticulars extends LitElement {
  static styles = css`
    .modal {
      padding: 20px;
      background: rgba(0, 9, 36, 0.8);
      color: white;
      border-radius: 10px;
      width: 425px;
      height: 500px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      opacity: 1;
      border: 1px solid rgba(42, 130, 228, 1);
    }

    .header {
      font-size: 24px;
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
      width: 400px;
      height: 420px; /* 高度缩小至原来的三分之二 */
    }
    .task-info h2 {
      margin: 0;
      padding-bottom: 1px; /* 内边距 */
      text-align: left;
      font-size: 20px; /* 字体大小 */
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
  static get properties() {
    return {
      devices: { type: Array  },
    };
  }

  constructor() {
    super();
    this.devices = [];
    this.fetchDevices(); // 初始化时获取设备审核数据
  }

  async fetchDevices() {
    try {
      const params = {
        pageNum: 1,
        pageSize: 100000,
        // 可以根据需要添加其他查询参数
      };
      const data = await deviceService.list(params);
      this.devices = data.rows;
    } catch (error) {
      console.error('获取设备审核数据失败:', error);
    }
  }

  render() {
    return html`
      <div class="modal">
        <div class="header">设备详情
        <button class="close-button" @click="${this.closeModal}">×</button>
        </div>
        <div class="task-info">
          <h2>设备信息</h2>
       <div class="row-task">
    <label for="task-name" style="display:inline-block;width:100px;">设备编号:</label>
    <input type="text" id="task-name" style="width:180px;height:25px;border-radius: 4px;" readonly />
</div>

<div class="row-task-number">
    <label for="task-number" style="display:inline-block;width:100px;">所属地区:</label>
    <input type="text" id="task-number" style="width:180px;height:25px;border-radius: 4px;" readonly />
</div>

<div class="row-start-time">
    <label for="start-time" style="display:inline-block;width:100px;">设备类型:</label>
    <select id="start-time" style="width:140px;height:35px;border-radius: 4px;" readonly>
    </select>
</div>

<div class="row-location">
    <label for="location" style="display:inline-block;width:100px;">偏磁角度:</label>
    <input id="location" style="width:180px;height:25px;border-radius: 4px;" readonly />
</div>

<div class="row-end-time">
    <label for="end-time" style="display:inline-block;width:100px;">安装方位角度:</label>
    <input type="text" id="end-time" style="width:180px;height:25px;border-radius: 4px;" readonly />
</div>

<div class="row-execution-time">
    <label for="execution-time-1" style="display:inline-block;width:100px;">安装俯仰角度:</label>
    <input type="text" id="execution-time-1" style="width:180px;height:25px;border-radius: 4px;" readonly />
</div>

<div class="row-device-longitude">
    <label for="device-longitude" style="display:inline-block;width:100px;">设备所在经度:</label>
    <input type="text" id="device-longitude" style="width:180px;height:25px;border-radius: 4px;" readonly />
</div>

<div class="row-device-latitude">
    <label for="device-latitude" style="display:inline-block;width:100px;">设备所在纬度:</label>
    <input type="text" id="device-latitude" style="width:180px;height:25px;border-radius: 4px;" readonly />
</div>

        </div>

      </div>
    `;
  }
  
  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
}

customElements.define('device-particulars', Deviceparticulars);
