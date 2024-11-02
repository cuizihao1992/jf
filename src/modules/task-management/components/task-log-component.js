import { LitElement, html, css } from 'lit';

class TaskLog extends LitElement {
  static styles = css`
    .modal {
      top: 15.3%;
      left: calc(50% + 300px);
      position: fixed; 
      padding: 20px;
      background: rgba(0, 9, 36, 0.8);
      color: white;
      border-radius: 10px;
      width: 590px;
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
      background-color: gray;
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
    }

    table {
      width: 100%;
      border-collapse: collapse;
      color: white;
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

    a {
      color: #1e90ff;
      cursor: pointer;
      text-decoration: none;
    }
    .table-container {
      max-height: 530px; /* 限制表格的最大高度 */
      overflow-y: auto; /* 仅表格内容滚动 */
    }           
  `;

  render() {
    return html`
      <div class="modal">
        <div class="header">设备日志<button class="close-button" @click="${this.closeModal}">×</button></div><hr />
        <div class="form-container">
          <div class="form-group">
            <label for="log-type">日志查询方式:</label>
            <select id="log-type">
              <option>设备编号</option>
            </select>
          </div>
          <div class="form-group">
            <label for="search-condition">查询条件:</label>
            <input type="text" id="search-condition" style="background-color: white;" />
          </div>
          <button class="query-button">查询</button>
        </div><hr />
        <div class="form-container">
          <div class="form-group">
            <label for="region">所属地区:</label>
            <select id="region">
              <option>中卫</option>
            </select>
          </div>
          <div class="form-group">
            <label for="device-type">设备类型:</label>
            <select id="device-type">
              <option>自动角反射器</option>
            </select>
          </div>
        </div>
        <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>日志编号</th>
              <th>设备编号</th>
              <th>所属地区</th>
              <th>设备类型</th>
              <th>操作内容</th>
            </tr>
          </thead>
          <tbody>
            <tr class="table-row">
              <td>1</td>
              <td>101</td>
              <td>中卫</td>
              <td>自动角反射器</td>
              <td>打开所有电源</td>
            </tr>
            <tr class="table-row">
              <td>1</td>
              <td>101</td>
              <td>中卫</td>
              <td>自动角反射器</td>
              <td>打开所有电源</td>
            </tr>
            <tr class="table-row">
              <td>1</td>
              <td>101</td>
              <td>中卫</td>
              <td>自动角反射器</td>
              <td>打开所有电源</td>
            </tr>
            <tr class="table-row">
              <td>1</td>
              <td>101</td>
              <td>中卫</td>
              <td>自动角反射器</td>
              <td>打开所有电源</td>
            </tr>
            <tr class="table-row">
              <td>1</td>
              <td>101</td>
              <td>中卫</td>
              <td>自动角反射器</td>
              <td>打开所有电源</td>
            </tr>
            <tr class="table-row">
              <td>1</td>
              <td>101</td>
              <td>中卫</td>
              <td>自动角反射器</td>
              <td>打开所有电源</td>
            </tr>
            <tr class="table-row">
              <td>1</td>
              <td>101</td>
              <td>中卫</td>
              <td>自动角反射器</td>
              <td>打开所有电源</td>
            </tr>
            <tr class="table-row">
              <td>1</td>
              <td>101</td>
              <td>中卫</td>
              <td>自动角反射器</td>
              <td>打开所有电源</td>
            </tr>
            <tr class="table-row">
              <td>1</td>
              <td>101</td>
              <td>中卫</td>
              <td>自动角反射器</td>
              <td>打开所有电源</td>
            </tr>
            <tr class="table-row">
              <td>1</td>
              <td>101</td>
              <td>中卫</td>
              <td>自动角反射器</td>
              <td>打开所有电源</td>
            </tr>
            <tr class="table-row">
              <td>1</td>
              <td>101</td>
              <td>中卫</td>
              <td>自动角反射器</td>
              <td>打开所有电源</td>
            </tr>
            <tr class="table-row">
              <td>1</td>
              <td>101</td>
              <td>中卫</td>
              <td>自动角反射器</td>
              <td>打开所有电源</td>
            </tr>
            <tr class="table-row">
              <td>1</td>
              <td>101</td>
              <td>中卫</td>
              <td>自动角反射器</td>
              <td>打开所有电源</td>
            </tr>
          </tbody>
        </table>
      </div>
      </div>
    `;
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
}

customElements.define('task-log-component', TaskLog);