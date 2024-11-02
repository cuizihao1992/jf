import { LitElement, html, css } from 'lit';

class deviceShenpi extends LitElement {

  static styles = css`
      .container {
        width: 455px; /* 增加整体宽度 */
        height: 650px; /* 设置高度为窗口高度 */
        padding: 15px; /* 内边距 */
        background-color: rgba(13, 31, 51, 0.9); /* 深色背景 */
        color: white;
        font-family: Arial, sans-serif;
        border-radius: 10px; /* 圆角 */
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
      }
   
      .header {
        grid-column: span 3; /* 占三列 */
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px; /* 下边距 */
      }
  
      .header h1 {
        margin: 1px;
        font-size: 24px; /* 字体大小 */
      }
      .close-button {
        cursor: pointer;
        font-size: 30px; /* 字体大小 */ 
      }
  
      .task-info {
        grid-column: 1; /* 占第一列 */
        display: grid;
        gap: 5px; /* 间距 */
        border: 1px solid #58a6ff;
        padding: 10px; /* 内边距 */
        border-radius: 5px;
        background-color: rgba(20, 30, 50, 0.8); /* 背景颜色 */
        width: 430px;
        height: 270px; /* 高度缩小至原来的三分之二 */
        margin-bottom: 10px; /* 下边距 */
      }
      .task-info h2 {
        margin: 0;
        padding-bottom: 1px; /* 内边距 */
        text-align: left;
        border-bottom: 1px solid #58a6ff;
        font-size: 16px; /* 字体大小 */
  
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
  
      .plus-minus {
        display: flex;
        flex-direction: column; /* 垂直排列 */
        align-items: center; /* 水平居中 */
        position:deliver;
        margin-right:45px;
      }
      .plus-minus button {
        background-color: #58a6ff;
        border: none;
        color: white;
        font-size: 44px; /* 字体大小 */
        padding: 0px; /* 内边距 */
        cursor: pointer;
        border-radius: 5px;
        margin: 90px 0; /* 上下间距 */
        width: 25px;
        height: 80px;
        margin-left: 5px;
      
      }
  
      
      .device-list {
        grid-column: 1; 
        display: flex;
        flex-direction: column;
        border: 1px solid #58a6ff; /* 边框 */
        border-radius: 5px; /* 圆角 */
        padding: 10px; /* 内边距 */
        background-color: rgba(20, 30, 50, 0.8); /* 背景颜色 */
        height:220px;
        width: 430px;
      }
      .device-list h3 {
        margin: 0;
        padding-bottom: 10px; /* 内边距 */
        font-size:16px;
      }
      .tbody-wrapper {
        border: 1px solid #58a6ff; /* 边框 */
        border-radius: 5px; /* 圆角 */
        padding: 1px; /* 内边距 */
        background-color: rgba(20, 30, 50, 0.8); /* 背景颜色 */
        width: 430px;
        height: 400px;
        overflow-y: auto;
      }
      .device-list-table {
        width: 300px;
        height:400px;
        border-collapse: collapse;
        font-size:12px;
        white-space: nowrap; 
  
      }
      .device-list-table th, .device-list-table td {
        padding: 8px; /* 内边距 */
        text-align: left;
        border: 1px solid #e6edf7; /* 添加网格线 */
      }
      .device-list-table th {
        position: sticky; /* 使标题行固定 */
        top: 0; /* 固定在顶部 */
        background-color: #0d1f33; /* 背景颜色 */
        color: white; /* 字体颜色 */
        z-index: 1; /* 确保在其他内容之上 */
      }
      .device-list-table tr:nth-child(even) {
        background-color: #13243a;
      }
      .power-status {
        background-color: #4CAF50; /* 按钮背景颜色 */
        color: white; /* 字体颜色 */
        padding: 1px 24px; /* 内边距 */
        border: none; /* 无边框 */
        border-radius: 5px; /* 圆角 */
        display: inline-flex; /* 使图标居中 */
        align-items: center; /* 垂直居中 */
        justify-content: center; /* 水平居中 */
        font-size: 16px; /* 字体大小 */
      }
      .button-group {
        display: flex;
        justify-content: space-between; /* 左右对齐 */
        align-items: center;
        margin-top: 15px; /* 上边距 */
      }
      .nav-button, .submit-button {
        background-color: #58a6ff;
        border: none;
        color: white;
        padding: 5px; /* 内边距 */
        font-size: 12px; /* 字体大小 */
        cursor: pointer;
        border-radius: 4px;
        text-align: center;
        width:60px;
      }
      .submit-button {
        background-color: #4CAF50; /* 提交按钮颜色 */
      }
      .footer-buttons {
        grid-column: span 3; /* 占三列 */
        display: flex;
        justify-content: space-between; /* 左右对齐 */
        align-items: center;
        margin-top: -90px; 
      }
      select{
      width:100px;
      font-size:12px;
      text-align: center; 
      }
      input{
      font-size:12px;
      text-align: center;
      }
      .tbody-new-wrapper{
      border: 1px solid #58a6ff; /* 边框 */
      border-radius: 5px; /* 圆角 */
      padding: 1px; /* 内边距 */
      background-color: rgba(20, 30, 50, 0.8); /* 背景颜色 */
      width: 580px;
      height: 480px;
      overflow-y: auto;
      }
      .review-info {
        display: flex;
        flex-direction: column;
        padding: 10px;
        background-color: rgba(20, 30, 50, 0.8);
        border: 1px solid #58a6ff;
        border-radius: 5px;
        height: 265px;
      }
      .review-info .row {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        width: 290px;
      }
      .review-info label {
        color: white;
        width: 80px;
        font-size: 14px;
      }
      .review-info input,
      .review-info textarea {
        flex: 1;
        padding: 5px;
        font-size: 14px;
        border-radius: 4px;
        border: 1px solid #58a6ff;
        background-color: rgba(255, 255, 255, 0.9);
      }
      .review-info textarea {
        height: 15px;
        resize: none;
      }
         .footer-buttons {
      grid-column: span 3;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-top: 20px;
    }
      .confirm-button {
      background-color: #4CAF50;
      color: white;
      padding: 8px 17px;
      border: none;
      border-radius: 5px;
      font-size: 14px;
      cursor: pointer;
      margin-right: 182px;
      margin-top: -22px;
    }
    `;

  render() {
    const deviceRows = [
      { id: 101, region: '中卫', type: '自动角反射器', status: '关机', time: '2024-9-24 16:21:45' },
      { id: 102, region: '中卫', type: '自动角反射器', status: '关机', time: '2024-9-24 16:21:45' },
      { id: 103, region: '中卫', type: '自动角反射器', status: '关机', time: '2024-9-24 16:21:45' },
      { id: 104, region: '中卫', type: '自动角反射器', status: '关机', time: '2024-9-24 16:21:45' },
      { id: 104, region: '中卫', type: '自动角反射器', status: '关机', time: '2024-9-24 16:21:45' },
      { id: 104, region: '中卫', type: '自动角反射器', status: '关机', time: '2024-9-24 16:21:45' },
      { id: 104, region: '中卫', type: '自动角反射器', status: '关机', time: '2024-9-24 16:21:45' },
      { id: 104, region: '中卫', type: '自动角反射器', status: '关机', time: '2024-9-24 16:21:45' },
      { id: 104, region: '中卫', type: '自动角反射器', status: '关机', time: '2024-9-24 16:21:45' },
      { id: 104, region: '中卫', type: '自动角反射器', status: '关机', time: '2024-9-24 16:21:45' },
      { id: 104, region: '中卫', type: '自动角反射器', status: '关机', time: '2024-9-24 16:21:45' },
    ];


    const deviceStatusRows = deviceRows.map(device => html`
          
      `);
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
    const deviceListTableRows = deviceListRows.map(device => html`
        <tr>
          <td>
            <input type="checkbox" id="device-${device.id}" />
            ${device.id}
            方位角: ${device.angle.horizontal}°
            仰俯角: ${device.angle.elevation}°
          </td>
          <td>
            水平角:
            <input type="text" placeholder="输入角度" style="width: 50px;" />
            俯仰角:
            <input type="text" placeholder="输入角度" style="width: 50px;" />
            
          </td>
        </tr>
      `);
    return html`
        <div class="container">
          <div class="header">
            <h1>设备审核</h1>
            <span class="close-button" @click="${this.handleClose}">×</span>
          </div>
          <div>
         <div class="task-info">
  <h2>设备信息</h2>
  <div class="row-task" style="display: flex; align-items: center;">
    <label for="task-name">设备编号:</label>
    <input type="text" id="task-name" placeholder="中卫101"
           style="margin-left:5px;width:100px;height:15px;border-radius: 4px;">
  </div>
  <div class="form-container">
    <div class="form-group" style="display: flex; align-items: center;margin-bottom: 10px;">
      <label for="location">所属地区:</label>
      <select id="location" style="margin-left:5px;background-color: gray;width: 100px;border-radius: 4px; ">
        <option>中卫</option>
      </select>
    </div>
    <div class="form-group" style="display: flex; align-items: center;">
      <label for="device-type">设备类型:</label>
      <select id="device-type" style="margin-left:5px;background-color: gray;width: 100px;border-radius: 4px;">
        <option>自动角反射器</option>
      </select>
    </div>
  </div>
  <div class="row-start-time" style="display: flex; align-items: center;">
    <label for="start-time">偏磁角度:</label>
    <input type="text" id="start-time"
           style="margin-left:5px;width:180px;height:15px;border-radius: 4px;">
  </div>
  <div class="row-end-time" style="display: flex; align-items: center;">
    <label for="end-time">安装方位角度:</label>
    <input type="text" id="end-time" 
           style="margin-left:5px;width:180px;height:15px;border-radius: 4px;">
  </div>
  <div class="row-execution-time" style="display: flex; align-items: center;">
    <label for="execution-time">安装俯仰角度:</label>
    <input type="number" id="execution-time" 
           style="margin-left:5px;width:180px;height:15px;border-radius: 4px;">
  </div>
  <div class="row-execution-time" style="display: flex; align-items: center;">
    <label for="latitude">设备所在纬度:</label>
    <input type="number" id="latitude" 
           style="margin-left:5px;width:180px;height:15px;border-radius: 4px;">
  </div>
  <div class="row-execution-time" style="display: flex; align-items: center;">
    <label for="longitude">设备所在经度:</label>
    <input type="number" id="longitude" 
           style="margin-left:5px;width:180px;height:15px;border-radius: 4px;">
  </div>
</div>
          <div class="review-info">
            <div class="row">
              <label for="reviewer">审核人:</label>
              <input type="text" id="reviewer" />
            </div>
            <div class="row">
              <label for="review-time">审核时间:</label>
              <input type="text" id="review-time">
            </div>
            <div class="row">
              <label for="review-opinion">审核意见:</label>
              <input type="text" id="review-opinion">
            </div>
            <div class="row" >
              <label for="notes" >备注:</label>
              <input type="text" id="review-opinion" style="width: 300px;height: 100px;"/>
            </div>
             <div class="footer-buttons">
          <button class="confirm-button" @click="${this.handleClose}">确定</button>
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


customElements.define('device-shenpi', deviceShenpi);