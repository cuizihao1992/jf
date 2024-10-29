import { LitElement, html, css } from "lit";

class TaskInfoComponent extends LitElement {
  static styles = css`
    .modal {
      position: fixed;
      top: 50%;
      left: 40%;
      transform: translate(-50%, -50%);
      padding: 20px;
      background: rgba(0, 9, 36, 0.8);
      color: white;
      border-radius: 10px;
      width: 900px;
      height: 700px; 
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      opacity: 1;
      border: 1px solid rgba(42, 130, 228, 1);
      overflow-y: auto;
      background-size: cover;
      background-position: center;
    }

    .header {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
      text-align: left;
    }

    .form-container {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      margin-bottom: 20px;
    }
    .form-group {
      display: flex;
      align-items: center;
      margin-right: 20px;
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
    }
    .query-button {
      padding: 8px 15px;
      background-color: #58a6ff;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      margin-left: 10px;
    }


    table {
      width: 100%;
      border-collapse: collapse;
      color: white;
      margin-top: 20px;
    }

    th {
      background-color: #1a2b4c;
      padding: 8px;
      text-align: center;
      border-bottom: 2px solid #444;
    }

    .table-row {
      border-bottom: 1px solid #444;
    }

    .table-row:last-child {
      border-bottom: none;
    }

    td {
      padding: 8px;
      text-align: center;
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
    .status-icon {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 81px;
      height: 20px;
      border-radius: 5px;
      margin-right: 5px;
    }
    .confirmation-modal{
      position: fixed;
      top: 50%;
      left: 80%;
      transform: translate(-50%, -50%);
      background-color: white;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      border-radius: 10px;
      padding: 20px;
      width: 300px; /* Adjust width as needed */
      max-width: 90%;
      text-align: center;
      font-family: Arial, sans-serif;
      z-index: 1000;
      
    }

    .status-online { background-color: green; }
    .status-warning { background-color: orange; }
    .status-offline { background-color: red; }

    a {
      color: #1e90ff;
      cursor: pointer;
      text-decoration: none;
    }
      .confirm-button,
      .cancel-button {
    background-color: #337ab7;
    border: none;
    color: white;
    padding: 10px 20px;
    font-size: 0.9rem;
    border-radius: 14px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-top: 25px;
    margin-right: 20px;
     box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 添加阴影效果 */
  }

  .confirm-button:hover,
  .cancel-button:hover {
    background-color: #285e8e;
  }

  .cancel-button {
    background-color: #337ab7;
    margin-left: 20px;
  }

  .cancel-button:hover {
    background-color: #555;
  }
  `;
  static get properties() {
    return {
      showConfirmation: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.showConfirmation = false; // Initialize state
  }


  render() {
    return html`
      <div class="modal">
        <div class="header">任务信息<button class="close-button" @click="${this.closeModal}">×</button></div><hr />
      <div class="form-container">
          <div class="form-group">
            <label for="search-type">任务查询类型:</label>
            <select id="search-type" style="background-color: gray;">
              <option>任务编号</option>
            </select>
          </div>
          <div class="form-group">
            <label for="search-condition">查询条件:</label>
            <input type="text" id="search-condition" style="background-color: white; " />
          </div>
          <button class="query-button">查询</button>
        </div><hr />
        <div class="form-container">
          <div class="form-group">
            <label for="device-type">设备类型:</label>
            <select id="device-type" style="background-color: gray;">
              <option>自动角反射器</option>
            </select>
          </div>
          <div class="form-group">
            <label for="location">所属地区:</label>
            <select id="location" style="background-color: gray;">
              <option>中卫</option>
            </select>
          </div>
          <div class="form-group">
            <label for="review-status">审批状态:</label>
            <select id="review-status" style="background-color: gray;">
              <option>已提交</option>
            </select>
          </div>
        </div>

  
        <table>
          <thead>
            <tr>
              <th>任务名</th>
              <th>任务编号</th>
              <th>提交用户名</th>
              <th>设备类型</th>
              <th>所属地区</th>
              <th>审批状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            ${this.renderRows()}
          </tbody>
        </table>
      </div>

       ${this.showConfirmation ? html`
        <div class="confirmation-modal">
          <div>提示:</div>
          <div>是否撤回此任务!!</div>
          <div class="confirmation-buttons">
            <button class="confirm-button" @click="${this.confirmRevoke}">确定</button>
            <button class="cancel-button" @click="${this.cancelRevoke}">取消</button>
          </div>
        </div>
      ` : ''}
    `;
  }

  renderRows() {
    const taskInfo = [
      { taskName: '任务名', taskId: '任务编号', submitName: '提交用户名', deviceType: '设备类型', region: '所属地区', approveStatus: '审批状态', operation: '操作' },
      { taskName: '任务名', taskId: '任务编号', submitName: '提交用户名', deviceType: '设备类型', region: '所属地区', approveStatus: '审批状态', operation: '操作' },
      { taskName: '任务名', taskId: '任务编号', submitName: '提交用户名', deviceType: '设备类型', region: '所属地区', approveStatus: '审批状态', operation: '操作' },
    ];

    return taskInfo.map(taskInfo => html`
      <tr class="table-row">
        <td>${taskInfo.taskName}</a></td>
        <td>${taskInfo.taskId}</td>
        <td>${taskInfo.submitName}</td>
        <td>${taskInfo.deviceType}</td>
        <td>${taskInfo.region}</td>
        <td>${taskInfo.approveStatus}</td>
        <td><a @click="${() => this.openTaskDetails()}">查看</a>
        /<a @click="${() => this.openTaskDetails()}">编辑</a>
        /<a @click="${() => this.openRevokeConfirmation()}">撤回</a></td>
      </tr>
    `);
  }
  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
  openTaskDetails() {
    this.showTaskDetails =true;
    this.showConfirmation=false;
    this.dispatchEvent(new CustomEvent('open-task-details'));
  }
  openRevokeConfirmation() {
    this.showConfirmation = true;
    this.showTaskDetails=false;
  }

  // Handle confirm action
  confirmRevoke() {
    this.showConfirmation = false;
    this.showTaskDetails=false;
    console.log('任务撤回 confirmed');
    // Add your revoke logic here
  }
  // Handle cancel action
  cancelRevoke() {
    this.showConfirmation = false;
  }

}

customElements.define("task-info-component", TaskInfoComponent);