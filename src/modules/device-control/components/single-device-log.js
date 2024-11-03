import { LitElement, html, css } from 'lit';

class SingleDeviceLog extends LitElement {
  static styles = css`
    .modal {
      top: 21%;
      left: calc(50% + 550px);
      position: fixed;
      padding: 20px;
      background: rgba(0, 9, 36, 0.8);
      color: white;
      border-radius: 10px;
      min-width: 650px;
      height: 600px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      opacity: 1;
      border: 1px solid rgba(42, 130, 228, 1);
      background-size: cover;
      background-position: center;
      z-index: 2;
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

    .status-online {
      background-color: green;
    }
    .status-warning {
      background-color: orange;
    }
    .status-offline {
      background-color: red;
    }

    a {
      color: #1e90ff;
      cursor: pointer;
      text-decoration: none;
    }
    .table-container {
      max-height: 510px; /* 限制表格的最大高度 */
      overflow-y: auto; /* 仅表格内容滚动 */
    }
  `;

  render() {
    return html`
      <div class="modal">
        <div class="header">
          设备日志<button class="close-button" @click="${this.closeModal}">
            ×
          </button>
        </div>
        <hr />
        <div class="form-container">
          <div class="form-group">
            <label for="search-type">日志查询方式:</label>
            <select id="search-type" style="background-color: gray;">
              <option>操作用户</option>
            </select>
          </div>
          <div class="form-group">
            <label for="search-condition">查询条件:</label>
            <input
              type="text"
              id="search-condition"
              style="background-color: white; "
            />
          </div>
          <button class="query-button">查询</button>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>日志编号</th>
                <th>日志生成时间</th>
                <th>操作用户</th>
                <th>设备编号</th>
                <th>所属地区</th>
                <th>操作内容</th>
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
    const deviceLog = [
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        deviceId: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
        operationContent: '打开所有电源',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        deviceId: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
        operationContent: '打开所有电源',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        deviceId: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
        operationContent: '打开所有电源',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        deviceId: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
        operationContent: '打开所有电源',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        deviceId: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
        operationContent: '打开所有电源',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        deviceId: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
        operationContent: '打开所有电源',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        deviceId: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
        operationContent: '打开所有电源',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        deviceId: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
        operationContent: '打开所有电源',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        deviceId: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
        operationContent: '打开所有电源',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        deviceId: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
        operationContent: '打开所有电源',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        deviceId: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
        operationContent: '打开所有电源',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        deviceId: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
        operationContent: '打开所有电源',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        deviceId: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
        operationContent: '打开所有电源',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        deviceId: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
        operationContent: '打开所有电源',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        deviceId: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
        operationContent: '打开所有电源',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        deviceId: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
        operationContent: '打开所有电源',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        deviceId: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
        operationContent: '打开所有电源',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        deviceId: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
        operationContent: '打开所有电源',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        deviceId: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
        operationContent: '打开所有电源',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        deviceId: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
        operationContent: '打开所有电源',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        deviceId: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
        operationContent: '打开所有电源',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        deviceId: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
        operationContent: '打开所有电源',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        deviceId: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
        operationContent: '打开所有电源',
      },
      {
        logId: 1,
        logTime: '2024-9-24 16:21:45',
        userName: '张三',
        deviceId: '自动角反射器',
        region: '中卫',
        deviceType: '自动角反射器',
        operationContent: '打开所有电源',
      },
    ];

    return deviceLog.map(
      (deviceLog) => html`
      <tr class="table-row">
        <td>${deviceLog.logId}</a></td>
        <td>${deviceLog.logTime}</td>
        <td>${deviceLog.userName}</td>
        <td>${deviceLog.deviceId}</td>
        <td>${deviceLog.region}</td>
        <td>${deviceLog.operationContent}</td>
      </tr>
    `
    );
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
}

customElements.define('single-device-log', SingleDeviceLog);
