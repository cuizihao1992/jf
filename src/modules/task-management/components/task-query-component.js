import { LitElement, html, css } from 'lit';

class TaskQueryComponent extends LitElement {
  static styles = css`
      .modal {
      position: fixed;
      top: 49%;
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
      margin-bottom: 10px;
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

    .status-online { background-color: green; }
    .status-warning { background-color: orange; }
    .status-offline { background-color: red; }

    a {
      color: #1e90ff;
      cursor: pointer;
      text-decoration: none;
    }
    .table-container {
      max-height: 565px; /* 限制表格的最大高度 */
      overflow-y: auto; /* 仅表格内容滚动 */
    }      
  `;

  render() {
    return html`
      <div class="modal">
        <div class="header">任务查询<button class="close-button" @click="${this.closeModal}">×</button></div><hr />
      <div class="form-container">
          <div class="form-group">
            <label for="search-type">任务查询方式:</label>
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
            <label for="location">所属地区:</label>
            <select id="location" style="background-color: gray;">
              <option>中卫</option>
            </select>
          </div>
          <div class="form-group">
            <label for="device-type">设备类型:</label>
            <select id="device-type" style="background-color: gray;">
              <option>自动角反射器</option>
            </select>
          </div>
          <div class="form-group">
            <label for="task-status">任务状态:</label>
            <select id="task-status" style="background-color: gray;">
              <option>未完成</option>
            </select>
          </div>
        </div>

        <div class="table-container">  
        <table>
          <thead>
            <tr>
              <th>任务名</th>
              <th>任务编号</th>
              <th>提交用户名</th>
              <th>设备类型</th>
              <th>所属地区</th>
              <th>任务状态</th>
              <th>审核人员</th>
              <th>任务详情</th>
              <th>故障详情</th>
              <th>日志详情</th>
            </tr>
          </thead>
          <tbody>
            ${this.renderRows()}
          </tbody>
        </table>
      </div>
      </div>
    `;
  }

  renderRows() {
    const taskQuery = [
      { taskName: '任务名', taskId: '任务编号', submitName: '提交用户名', deviceType: '设备类型', region: '所属地区', taskStatus: '任务状态', auditUser: '审核人员' },
      { taskName: '任务名', taskId: '任务编号', submitName: '提交用户名', deviceType: '设备类型', region: '所属地区', taskStatus: '任务状态', auditUser: '审核人员' },
      { taskName: '任务名', taskId: '任务编号', submitName: '提交用户名', deviceType: '设备类型', region: '所属地区', taskStatus: '任务状态', auditUser: '审核人员' },
      { taskName: '任务名', taskId: '任务编号', submitName: '提交用户名', deviceType: '设备类型', region: '所属地区', taskStatus: '任务状态', auditUser: '审核人员' },
      { taskName: '任务名', taskId: '任务编号', submitName: '提交用户名', deviceType: '设备类型', region: '所属地区', taskStatus: '任务状态', auditUser: '审核人员' },
      { taskName: '任务名', taskId: '任务编号', submitName: '提交用户名', deviceType: '设备类型', region: '所属地区', taskStatus: '任务状态', auditUser: '审核人员' },
      { taskName: '任务名', taskId: '任务编号', submitName: '提交用户名', deviceType: '设备类型', region: '所属地区', taskStatus: '任务状态', auditUser: '审核人员' },
      { taskName: '任务名', taskId: '任务编号', submitName: '提交用户名', deviceType: '设备类型', region: '所属地区', taskStatus: '任务状态', auditUser: '审核人员' },
      { taskName: '任务名', taskId: '任务编号', submitName: '提交用户名', deviceType: '设备类型', region: '所属地区', taskStatus: '任务状态', auditUser: '审核人员' },
      { taskName: '任务名', taskId: '任务编号', submitName: '提交用户名', deviceType: '设备类型', region: '所属地区', taskStatus: '任务状态', auditUser: '审核人员' },
      { taskName: '任务名', taskId: '任务编号', submitName: '提交用户名', deviceType: '设备类型', region: '所属地区', taskStatus: '任务状态', auditUser: '审核人员' },
      { taskName: '任务名', taskId: '任务编号', submitName: '提交用户名', deviceType: '设备类型', region: '所属地区', taskStatus: '任务状态', auditUser: '审核人员' },
      { taskName: '任务名', taskId: '任务编号', submitName: '提交用户名', deviceType: '设备类型', region: '所属地区', taskStatus: '任务状态', auditUser: '审核人员' },
      { taskName: '任务名', taskId: '任务编号', submitName: '提交用户名', deviceType: '设备类型', region: '所属地区', taskStatus: '任务状态', auditUser: '审核人员' },
      { taskName: '任务名', taskId: '任务编号', submitName: '提交用户名', deviceType: '设备类型', region: '所属地区', taskStatus: '任务状态', auditUser: '审核人员' },
      { taskName: '任务名', taskId: '任务编号', submitName: '提交用户名', deviceType: '设备类型', region: '所属地区', taskStatus: '任务状态', auditUser: '审核人员' },
      { taskName: '任务名', taskId: '任务编号', submitName: '提交用户名', deviceType: '设备类型', region: '所属地区', taskStatus: '任务状态', auditUser: '审核人员' },
      { taskName: '任务名', taskId: '任务编号', submitName: '提交用户名', deviceType: '设备类型', region: '所属地区', taskStatus: '任务状态', auditUser: '审核人员' },
      { taskName: '任务名', taskId: '任务编号', submitName: '提交用户名', deviceType: '设备类型', region: '所属地区', taskStatus: '任务状态', auditUser: '审核人员' },
      { taskName: '任务名', taskId: '任务编号', submitName: '提交用户名', deviceType: '设备类型', region: '所属地区', taskStatus: '任务状态', auditUser: '审核人员' },
      { taskName: '任务名', taskId: '任务编号', submitName: '提交用户名', deviceType: '设备类型', region: '所属地区', taskStatus: '任务状态', auditUser: '审核人员' },
    ];

    return taskQuery.map(taskQuery => html`
      <tr class="table-row">
        <td>${taskQuery.taskName}</a></td>
        <td>${taskQuery.taskId}</td>
        <td>${taskQuery.submitName}</td>
        <td>${taskQuery.deviceType}</td>
        <td>${taskQuery.region}</td>
        <td>${taskQuery.taskStatus}</td>
        <td>${taskQuery.auditUser}</td>
        <td><a @click="${() => this.openTaskDetails()}">查看</a></td>
        <td><a @click="${() => this.openFaultDetails()}">查看</a></td>
        <td><a @click="${() => this.openTaskLog()}">查看</a></td>
      </tr>
    `);
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
  openTaskDetails() {
    console.log('open task details');
    
    this.dispatchEvent(new CustomEvent('open-task-details'));
  }

  openFaultDetails() {
    this.dispatchEvent(new CustomEvent('open-fault-details'));
  }
  openTaskLog() {
    this.dispatchEvent(new CustomEvent('open-task-log-component'));
  }


}

customElements.define('task-query-component', TaskQueryComponent);
